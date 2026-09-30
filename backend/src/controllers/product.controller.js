import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const PAGE_SIZE = 12;

function parsePrice(value, name) {
  if (value === undefined) return undefined;
  if (typeof value !== "string" || value.trim() === "") {
    throw new ApiError(400, `Le filtre ${name} est invalide.`);
  }

  const price = Number(value);
  if (!Number.isFinite(price) || price < 0) {
    throw new ApiError(400, `Le filtre ${name} est invalide.`);
  }

  return price;
}

export async function listProducts(req, res) {
  const { category, q, minPrice, maxPrice, sort = "newest", page = "1" } = req.query;
  const where = { isActive: true };

  if (category !== undefined) {
    if (typeof category !== "string") throw new ApiError(400, "La catégorie est invalide.");
    if (category === "nouveautes") {
      where.isNew = true;
    } else if (category) {
      where.category = category;
    }
  }

  if (q !== undefined) {
    if (typeof q !== "string") throw new ApiError(400, "La recherche est invalide.");
    if (q.trim()) where.name = { contains: q.trim(), mode: "insensitive" };
  }

  const minimum = parsePrice(minPrice, "minPrice");
  const maximum = parsePrice(maxPrice, "maxPrice");
  if (minimum !== undefined || maximum !== undefined) {
    if (minimum !== undefined && maximum !== undefined && minimum > maximum) {
      throw new ApiError(400, "Le prix minimum doit être inférieur ou égal au prix maximum.");
    }
    where.price = {};
    if (minimum !== undefined) where.price.gte = minimum;
    if (maximum !== undefined) where.price.lte = maximum;
  }

  if (typeof sort !== "string") throw new ApiError(400, "Le tri est invalide.");
  const orderBy =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
      ? { price: "desc" }
      : sort === "popular"
      ? { popularity: "desc" }
      : { createdAt: "desc" };

  const pageNum = Number(page);
  if (typeof page !== "string" || !Number.isSafeInteger(pageNum) || pageNum < 1) {
    throw new ApiError(400, "La page demandée est invalide.");
  }

  const skip = (pageNum - 1) * PAGE_SIZE;
  if (!Number.isSafeInteger(skip)) throw new ApiError(400, "La page demandée est invalide.");

  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip, take: PAGE_SIZE }),
    prisma.product.count({ where }),
  ]);

  res.json({
    items,
    page: pageNum,
    pageSize: PAGE_SIZE,
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
  });
}

export async function getProductBySlug(req, res) {
  const product = await prisma.product.findFirst({
    where: { slug: req.params.slug, isActive: true },
  });

  if (!product) throw new ApiError(404, "Produit introuvable.");

  res.json(product);
}

export async function getRelatedProducts(req, res) {
  const product = await prisma.product.findFirst({
    where: { slug: req.params.slug, isActive: true },
  });

  if (!product) throw new ApiError(404, "Produit introuvable.");

  const related = await prisma.product.findMany({
    where: {
      category: product.category,
      isActive: true,
      id: { not: product.id },
    },
    take: 4,
  });

  res.json(related);
}