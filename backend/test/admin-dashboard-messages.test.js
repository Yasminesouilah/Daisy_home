import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { getDashboardStats } from "../src/controllers/admin/dashboard.controller.js";
import {
  deleteMessage,
  listAdminMessages,
  markMessageRead,
} from "../src/controllers/admin/message.controller.js";
import { prisma } from "../src/lib/prisma.js";

const message = {
  id: "message-1",
  name: "Yasmine",
  phone: "0555123456",
  email: "",
  message: "Bonjour, je souhaite des informations.",
  isRead: false,
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

describe("admin dashboard and messages controllers", () => {
  beforeEach(() => {
    state = { message: { ...message }, messageQuery: undefined, messageCountQuery: undefined };
    originalMethods = {
      orderCount: prisma.order.count,
      orderAggregate: prisma.order.aggregate,
      orderFindMany: prisma.order.findMany,
      productFindMany: prisma.product.findMany,
      messageCount: prisma.message.count,
      messageFindMany: prisma.message.findMany,
      messageFindUnique: prisma.message.findUnique,
      messageUpdate: prisma.message.update,
      messageDelete: prisma.message.delete,
    };

    prisma.order.count = async () => 3;
    prisma.order.aggregate = async () => ({ _sum: { total: 12500 } });
    prisma.order.findMany = async () => [{ id: "order-1", orderNumber: "DH-1001" }];
    prisma.product.findMany = async () => [{ id: "product-1", name: "Vase", stock: 2 }];
    prisma.message.count = async ({ where }) => {
      state.messageCountQuery = where;
      return 4;
    };
    prisma.message.findMany = async (args) => {
      state.messageQuery = args;
      return [state.message];
    };
    prisma.message.findUnique = async ({ where }) =>
      where.id === state.message?.id ? state.message : null;
    prisma.message.update = async ({ data }) => {
      state.message = { ...state.message, ...data };
      return state.message;
    };
    prisma.message.delete = async () => {
      const deleted = state.message;
      state.message = null;
      return deleted;
    };
  });

  afterEach(() => {
    prisma.order.count = originalMethods.orderCount;
    prisma.order.aggregate = originalMethods.orderAggregate;
    prisma.order.findMany = originalMethods.orderFindMany;
    prisma.product.findMany = originalMethods.productFindMany;
    prisma.message.count = originalMethods.messageCount;
    prisma.message.findMany = originalMethods.messageFindMany;
    prisma.message.findUnique = originalMethods.messageFindUnique;
    prisma.message.update = originalMethods.messageUpdate;
    prisma.message.delete = originalMethods.messageDelete;
  });

  it("returns dashboard metrics, recent orders, and low-stock products", async () => {
    const res = response();
    await getDashboardStats({}, res);

    assert.equal(res.body.ordersToday, 3);
    assert.equal(res.body.ordersThisWeek, 3);
    assert.equal(res.body.pendingOrders, 3);
    assert.equal(res.body.totalRevenue, 12500);
    assert.equal(res.body.unreadMessages, 4);
    assert.equal(res.body.recentOrders[0].orderNumber, "DH-1001");
    assert.equal(res.body.lowStockProducts[0].stock, 2);
  });

  it("lists messages with read filter and pagination", async () => {
    const res = response();
    await listAdminMessages({ query: { isRead: "false", page: "2" } }, res);

    assert.deepEqual(state.messageQuery.where, { isRead: false });
    assert.equal(state.messageQuery.skip, 20);
    assert.equal(state.messageQuery.take, 20);
    assert.deepEqual(res.body.items, [message]);
    assert.equal(res.body.page, 2);
    assert.equal(res.body.totalPages, 1);
  });

  it("rejects invalid message filters and pages", async () => {
    await assert.rejects(
      listAdminMessages({ query: { isRead: "sometimes" } }, response()),
      (error) => error.status === 400,
    );
    await assert.rejects(
      listAdminMessages({ query: { page: "0" } }, response()),
      (error) => error.status === 400,
    );
  });

  it("marks an existing message as read", async () => {
    const res = response();
    await markMessageRead({ params: { id: message.id } }, res);
    assert.equal(res.body.isRead, true);
  });

  it("deletes existing messages and returns 404 for unknown ids", async () => {
    const res = response();
    await deleteMessage({ params: { id: message.id } }, res);
    assert.deepEqual(res.body, { ok: true });

    await assert.rejects(
      deleteMessage({ params: { id: "missing" } }, response()),
      (error) => error.status === 404,
    );
  });
});