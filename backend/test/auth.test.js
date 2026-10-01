import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { afterEach, beforeEach, describe, it } from "node:test";
import { login } from "../src/controllers/auth.controller.js";
import { requireAdmin } from "../src/middleware/auth.js";
import { prisma } from "../src/lib/prisma.js";
import { signAdminToken, verifyToken } from "../src/utils/jwt.js";

const password = "correct-horse-battery";
const admin = {
  id: "admin-test-id",
  email: "owner@example.com",
  passwordHash: await bcrypt.hash(password, 4),
};

let originalFindUnique;

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

describe("admin authentication", () => {
  beforeEach(() => {
    originalFindUnique = prisma.admin.findUnique;
    prisma.admin.findUnique = async ({ where }) =>
      where.email === admin.email ? admin : null;
  });

  afterEach(() => {
    prisma.admin.findUnique = originalFindUnique;
  });

  it("issues a signed token for valid credentials", async () => {
    const res = makeResponse();
    await login({ body: { email: " owner@example.com ", password } }, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body.admin, { id: admin.id, email: admin.email });
    assert.deepEqual(verifyToken(res.body.token).sub, admin.id);
    assert.equal(verifyToken(res.body.token).email, admin.email);
  });

  it("rejects wrong passwords and unknown accounts uniformly", async () => {
    await assert.rejects(
      login({ body: { email: admin.email, password: "incorrect-password" } }, makeResponse()),
      (error) => error.status === 401 && error.message === "Identifiants invalides.",
    );
    await assert.rejects(
      login({ body: { email: "missing@example.com", password } }, makeResponse()),
      (error) => error.status === 401 && error.message === "Identifiants invalides.",
    );
  });

  it("validates login input before querying accounts", async () => {
    await assert.rejects(
      login({ body: { email: "not-an-email", password: "" } }, makeResponse()),
      (error) => error.status === 400,
    );
  });

  it("accepts a valid bearer token and attaches the admin identity", () => {
    const req = { headers: { authorization: `Bearer ${signAdminToken(admin)}` } };
    let forwardedError;
    requireAdmin(req, {}, (error) => {
      forwardedError = error;
    });

    assert.equal(forwardedError, undefined);
    assert.deepEqual(req.admin, { id: admin.id, email: admin.email });
  });

  it("rejects missing and invalid bearer tokens", () => {
    for (const authorization of [undefined, "Bearer not-a-token"]) {
      let forwardedError;
      requireAdmin({ headers: { authorization } }, {}, (error) => {
        forwardedError = error;
      });
      assert.equal(forwardedError.status, 401);
    }
  });
});