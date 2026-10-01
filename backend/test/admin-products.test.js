import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
  createProduct,
  deleteProduct,
  listAdminProducts,
  updateProduct,
} from "../src/controllers/admin/product.controller.js";
import { prisma } from "../src/lib/prisma.js";
import { productSchema } from "../src/validators/product.validator.js";

const productId = "cmf8u7q3f0000abcd1234efgh";
const existingImage = "https://images.example.com/vase.jpg";
const product = {
  id: productId,
  name: "Vase",
  slug: "vase",
  category: "decoration",
  price: 2900,
  oldPrice: null,
  images: [existingImage],
  description: "Un vase.",
  variants: [],
  isNew: false,
  stock: 4,
  isActive: true,
};

const validBody = {
  name: "Nouveau vase",
  slug: "nouveau-vase",
  category: "decoration",
  price: "3200",
  oldPrice: "",
  description: "Une description.",
  variants: "[]",
  isNew: "false",
  stock: "3",
  isActive: "true",
};

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

describe("admin product controller", () => {
  beforeEach(() => {
    originalMethods = {
      findMany: prisma.product.findMany,
      findUnique: prisma.product.findUnique,
      create: prisma.product.create,
      update: prisma.product.update,
      delete: prisma.product.delete,
    };
    prisma.product.findMany = async () => [product];
    prisma.product.findUnique = async ({ where }) => {
      if (where.id) return where.id === productId ? product : null;
      return where.slug === product.slug ? product : null;
    };
    prisma.product.create = async ({ data }) => ({ id: productId, ...data });
    prisma.product.update = async ({ data }) => ({ ...product, ...data });
    prisma.product.delete = async () => product;
  });

  afterEach(() => {
    Object.assign(prisma.product, originalMethods);
  });

  it("lists products from Prisma", async () => {
    const res = response();
    await listAdminProducts({}, res);
    assert.deepEqual(res.body, [product]);
  });

  it("rejects create requests without an uploaded image", async () => {
    await assert.rejects(
      createProduct({ body: validBody, files: [] }, response()),
      (error) => error.status === 400 && error.message.includes("image"),
    );
  });

  it("rejects malformed variants before touching the database", async () => {
    await assert.rejects(
      createProduct({ body: { ...validBody, variants: "{" }, files: [] }, response()),
      (error) => error.status === 400 && error.message.includes("variantes"),
    );
  });

  it("accepts new category slugs without a predefined category list", () => {
    const parsed = productSchema.safeParse({
      name: "Lampe de table",
      slug: "lampe-de-table",
      category: "luminaires-interieur",
      price: 4900,
      description: "",
      variants: [],
    });

    assert.equal(parsed.success, true);
    assert.equal(parsed.data.category, "luminaires-interieur");
  });

  it("rejects duplicate slugs", async () => {
    await assert.rejects(
      createProduct(
        { body: { ...validBody, slug: product.slug }, files: [{ buffer: Buffer.from("image") }] },
        response(),
      ),
      (error) => error.status === 409,
    );
  });

  it("updates product fields while retaining only selected existing images", async () => {
    const res = response();
    await updateProduct(
      {
        params: { id: productId },
        body: { price: "3400", keepImages: JSON.stringify([existingImage]) },
        files: [],
      },
      res,
    );

    assert.equal(res.body.price, 3400);
    assert.deepEqual(res.body.images, [existingImage]);
  });

  it("rejects client-supplied URLs that are not existing product images", async () => {
    await assert.rejects(
      updateProduct(
        {
          params: { id: productId },
          body: { keepImages: JSON.stringify(["https://attacker.example/fake.jpg"]) },
          files: [],
        },
        response(),
      ),
      (error) => error.status === 400,
    );
  });

  it("deletes an existing product", async () => {
    const res = response();
    await deleteProduct({ params: { id: productId } }, res);
    assert.deepEqual(res.body, { ok: true });
  });
});