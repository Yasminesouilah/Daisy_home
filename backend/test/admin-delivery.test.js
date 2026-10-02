import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
  listAdminDeliveryRates,
  updateAdminDeliveryRate,
} from "../src/controllers/admin/delivery.controller.js";
import { getDeliveryFees } from "../src/controllers/delivery.controller.js";
import { prisma } from "../src/lib/prisma.js";

const initialRate = {
  code: "16",
  name: "Alger",
  homeFee: 400,
  officeFee: 250,
  updatedAt: new Date("2026-10-01T12:00:00.000Z"),
};

let rate;
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

describe("delivery rate controllers", () => {
  beforeEach(() => {
    rate = { ...initialRate };
    originalMethods = {
      findMany: prisma.deliveryRate.findMany,
      findUnique: prisma.deliveryRate.findUnique,
      update: prisma.deliveryRate.update,
    };
    prisma.deliveryRate.findMany = async () => [rate];
    prisma.deliveryRate.findUnique = async ({ where }) => where.code === rate.code ? rate : null;
    prisma.deliveryRate.update = async ({ data }) => {
      rate = { ...rate, ...data };
      return rate;
    };
  });

  afterEach(() => {
    prisma.deliveryRate.findMany = originalMethods.findMany;
    prisma.deliveryRate.findUnique = originalMethods.findUnique;
    prisma.deliveryRate.update = originalMethods.update;
  });

  it("lists rates for the admin", async () => {
    const res = response();
    await listAdminDeliveryRates({}, res);
    assert.deepEqual(res.body, [initialRate]);
  });

  it("updates home and office rates", async () => {
    const res = response();
    await updateAdminDeliveryRate(
      { params: { code: "16" }, body: { homeFee: 500, officeFee: 300 } },
      res,
    );
    assert.equal(res.body.homeFee, 500);
    assert.equal(res.body.officeFee, 300);
  });

  it("rejects invalid rates and unknown wilayas", async () => {
    await assert.rejects(
      updateAdminDeliveryRate(
        { params: { code: "16" }, body: { homeFee: -1, officeFee: 300 } },
        response(),
      ),
      (error) => error.status === 400,
    );
    await assert.rejects(
      updateAdminDeliveryRate(
        { params: { code: "99" }, body: { homeFee: 500, officeFee: 300 } },
        response(),
      ),
      (error) => error.status === 404,
    );
  });

  it("returns both delivery rates from the public fee endpoint", async () => {
    const res = response();
    await getDeliveryFees({}, res);
    assert.deepEqual(res.body[0], { ...initialRate, fee: initialRate.homeFee });
  });
});