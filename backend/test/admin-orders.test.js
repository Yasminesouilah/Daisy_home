import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
  getAdminOrder,
  listAdminOrders,
  searchAdminOrders,
  updateOrderStatus,
} from "../src/controllers/admin/order.controller.js";
import { prisma } from "../src/lib/prisma.js";

const orderId = "cmf8u7q3f0000abcd1234efgh";
const order = {
  id: orderId,
  orderNumber: "DH-1001",
  customer: { fullName: "Yasmine Benali", phone: "0555123456" },
  items: [{ productId: "cmf8u7q3f0000abcd1234ijkl", quantity: 2 }],
  status: "pending",
  createdAt: new Date("2026-09-01T12:00:00.000Z"),
};

let state;
let originalMethods;

function response() {
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

describe("admin order controller", () => {
  beforeEach(() => {
    state = { order: { ...order }, stock: 3, query: undefined };
    originalMethods = {
      findMany: prisma.order.findMany,
      findUnique: prisma.order.findUnique,
      count: prisma.order.count,
      updateMany: prisma.order.updateMany,
      productUpdateMany: prisma.product.updateMany,
      transaction: prisma.$transaction,
    };
    prisma.order.findMany = async (args) => {
      state.query = args;
      return [state.order];
    };
    prisma.order.count = async () => 21;
    prisma.order.findUnique = async () => state.order;
    prisma.order.updateMany = async ({ where, data }) => {
      if (state.order.status !== where.status) return { count: 0 };
      state.order = { ...state.order, status: data.status };
      return { count: 1 };
    };
    prisma.product.updateMany = async ({ where, data }) => {
      if (where.id !== order.items[0].productId) return { count: 0 };
      state.stock += data.stock.increment;
      return { count: 1 };
    };
    prisma.$transaction = async (run) => {
      const tx = {
        order: {
          findUnique: async () => state.order,
          updateMany: prisma.order.updateMany,
        },
        product: { updateMany: prisma.product.updateMany },
      };
      return run(tx);
    };
  });

  afterEach(() => {
    prisma.order.findMany = originalMethods.findMany;
    prisma.order.findUnique = originalMethods.findUnique;
    prisma.order.count = originalMethods.count;
    prisma.order.updateMany = originalMethods.updateMany;
    prisma.product.updateMany = originalMethods.productUpdateMany;
    prisma.$transaction = originalMethods.transaction;
  });

  it("lists orders with status and pagination filters", async () => {
    const res = response();
    await listAdminOrders({ query: { status: "pending", page: "2" } }, res);
    assert.equal(state.query.where.status, "pending");
    assert.equal(state.query.skip, 20);
    assert.equal(state.query.take, 20);
    assert.equal(res.body.totalPages, 2);
  });

  it("searches recent order snapshots by customer name, phone, or number", async () => {
    const res = response();
    await searchAdminOrders({ query: { q: "Yasmine" } }, res);
    assert.equal(state.query.take, 200);
    assert.deepEqual(res.body.items.map((item) => item.id), [orderId]);
  });

  it("returns 404 for a missing order", async () => {
    prisma.order.findUnique = async () => null;
    await assert.rejects(
      getAdminOrder({ params: { id: "missing" } }, response()),
      (error) => error.status === 404,
    );
  });

  it("restores stock only once when an order is cancelled", async () => {
    const first = response();
    await updateOrderStatus({ params: { id: orderId }, body: { status: "cancelled" } }, first);
    assert.equal(state.stock, 5);
    assert.equal(first.body.status, "cancelled");

    const second = response();
    await updateOrderStatus({ params: { id: orderId }, body: { status: "cancelled" } }, second);
    assert.equal(state.stock, 5);
  });

  it("does not allow a cancelled order to be reopened", async () => {
    state.order.status = "cancelled";
    await assert.rejects(
      updateOrderStatus({ params: { id: orderId }, body: { status: "confirmed" } }, response()),
      (error) => error.status === 409,
    );
    assert.equal(state.stock, 3);
  });

  it("rejects invalid statuses", async () => {
    await assert.rejects(
      updateOrderStatus({ params: { id: orderId }, body: { status: "processing" } }, response()),
      (error) => error.status === 400,
    );
  });
});