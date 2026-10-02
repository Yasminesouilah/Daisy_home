import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { createOrder } from "../src/controllers/order.controller.js";
import { prisma } from "../src/lib/prisma.js";

const productId = "cmf8u7q3f0000abcd1234efgh";
const product = {
  id: productId,
  name: "Bougie parfumée",
  price: 4500,
  stock: 30,
  images: ["/bougie.jpg"],
  variants: [{ label: "Parfum", options: ["Vanille", "Figue"] }],
  isActive: true,
};

const validRequest = {
  customer: {
    fullName: "Yasmine Benali",
    phone: "0555123456",
    wilaya: "16",
    commune: "Hydra",
    address: "12 Rue des Oliviers",
  },
  items: [{ productId, quantity: 2 }],
};

let state;
let originalTransaction;

function makeResponse() {
  return {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

async function submit(body) {
  const res = makeResponse();
  await createOrder({ body }, res);
  return res;
}

describe("createOrder", () => {
  beforeEach(() => {
    state = {
      stock: product.stock,
      sequence: 1000,
      orders: [],
      deliveryRate: { homeFee: 400, officeFee: 250 },
    };
    originalTransaction = prisma.$transaction;
    prisma.$transaction = async (run) => {
      const before = { ...state, orders: [...state.orders] };
      const tx = {
        deliveryRate: {
          findUnique: async ({ where }) => where.code === "16" ? state.deliveryRate : null,
        },
        product: {
          findMany: async ({ where }) =>
            where.id.in.includes(productId) && where.isActive
              ? [{ ...product, stock: state.stock }]
              : [],
          updateMany: async ({ where, data }) => {
            if (state.stock < where.stock.gte) return { count: 0 };
            state.stock -= data.stock.decrement;
            return { count: 1 };
          },
        },
        counter: {
          upsert: async () => ({ seq: ++state.sequence }),
        },
        order: {
          create: async ({ data }) => {
            const order = { id: "mock-order-id", ...data };
            state.orders.push(order);
            return order;
          },
        },
      };

      try {
        return await run(tx);
      } catch (error) {
        state = before;
        throw error;
      }
    };
  });

  afterEach(() => {
    prisma.$transaction = originalTransaction;
  });

  it("uses database prices, server delivery fees, and sequential numbers", async () => {
    const res = await submit({
      ...validRequest,
      deliveryFee: 1,
      total: 1,
      items: [{ ...validRequest.items[0], price: 1 }],
    });

    assert.equal(res.statusCode, 201);
    assert.equal(res.body.orderNumber, "DH-1001");
    assert.equal(res.body.items[0].price, 4500);
    assert.equal(res.body.subtotal, 9000);
    assert.equal(res.body.deliveryFee, 400);
    assert.equal(res.body.total, 9400);
    assert.equal(res.body.deliveryMethod, "home");
    assert.equal(res.body.customer.wilayaName, "Alger");
    assert.equal(state.stock, 28);

    const next = await submit(validRequest);
    assert.equal(next.body.orderNumber, "DH-1002");
  });

  it("uses the office rate when office delivery is selected", async () => {
    const res = await submit({ ...validRequest, deliveryMethod: "office" });
    assert.equal(res.body.deliveryMethod, "office");
    assert.equal(res.body.deliveryFee, 250);
    assert.equal(res.body.total, 9250);
  });

  it("rejects an unsupported delivery method", async () => {
    await assert.rejects(
      submit({ ...validRequest, deliveryMethod: "express" }),
      (error) => error.status === 400,
    );
    assert.equal(state.orders.length, 0);
  });

  it("rejects ordering when the wilaya delivery rate is missing", async () => {
    state.deliveryRate = null;
    await assert.rejects(
      submit(validRequest),
      (error) => error.status === 400 && error.message.includes("Tarifs de livraison"),
    );
    assert.equal(state.orders.length, 0);
  });

  it("rolls back stock when order creation fails inside the transaction", async () => {
    const transaction = prisma.$transaction;
    prisma.$transaction = (run) =>
      transaction((tx) => {
        tx.order.create = async () => {
          throw new Error("Simulated order write failure");
        };
        return run(tx);
      });

    await assert.rejects(submit(validRequest), /Simulated order write failure/);
    assert.equal(state.stock, 30);
    assert.equal(state.orders.length, 0);
  });

  it("rejects an unknown wilaya before opening a transaction", async () => {
    await assert.rejects(
      submit({ ...validRequest, customer: { ...validRequest.customer, wilaya: "99" } }),
      (error) => error.status === 400 && error.message === "Wilaya invalide.",
    );
    assert.equal(state.orders.length, 0);
  });

  it("rejects invalid variants", async () => {
    await assert.rejects(
      submit({ ...validRequest, items: [{ ...validRequest.items[0], variant: "Chocolat" }] }),
      (error) => error.status === 400 && error.message.includes("Variante invalide"),
    );
    assert.equal(state.stock, 30);
  });

  it("aggregates duplicate product lines before checking and decrementing stock", async () => {
    state.stock = 15;
    await assert.rejects(
      submit({
        ...validRequest,
        items: [
          { productId, quantity: 10 },
          { productId, quantity: 10, variant: "Vanille" },
        ],
      }),
      (error) => error.status === 409 && error.message.includes("Stock insuffisant"),
    );
    assert.equal(state.stock, 15);
    assert.equal(state.orders.length, 0);
  });

  it("offers free delivery at the configured subtotal threshold", async () => {
    const res = await submit({ ...validRequest, items: [{ productId, quantity: 4 }] });
    assert.equal(res.body.subtotal, 18000);
    assert.equal(res.body.deliveryFee, 0);
  });

  it("rejects malformed product ids and missing customer fields", async () => {
    await assert.rejects(
      submit({ ...validRequest, items: [{ productId: "p01", quantity: 1 }] }),
      (error) => error.status === 400,
    );
    const { phone, ...customer } = validRequest.customer;
    await assert.rejects(
      submit({ ...validRequest, customer }),
      (error) => error.status === 400,
    );
  });
});