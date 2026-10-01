import { prisma } from "../../lib/prisma.js";
import { productSchema, productUpdateSchema } from "../../validators/product.validator.js";
import { uploadImageBuffer } from "../../utils/uploadImage.js";
import { ApiError } from "../../utils/ApiError.js";

const MAX_IMAGES = 5;

function parseProductBody(body) {
  const parsed = { ...body };

  if (typeof parsed.variants === "string") {
    try {
      parsed.variants = JSON.parse(parsed.variants);
    } catch {
      throw new ApiError(400, "Le format des variantes est invalide.");
    }
  }

  for (const field of ["price", "stock"]) {
    if (typeof parsed[field] === "string") {
      parsed[field] = Number(parsed[field]);
    }
  }

  if (typeof parsed.oldPrice === "string") {
    parsed.oldPrice = parsed.oldPrice.trim() ? Number(parsed.oldPrice) : null;
  }

  for (const field of ["isNew", "isActive"]) {
    if (typeof parsed[field] === "string") {
      if (parsed[field] !== "true" && parsed[field] !== "false") {
        throw new ApiError(400, `La valeur ${field} est invalide.`);
      }
      parsed[field] = parsed[field] === "true";
    }
  }

  return parsed;
}

function parseKeepImages(value, existingImages) {
  if (value === undefined) return existingImages;

  let requested;
  try {
    requested = JSON.parse(value);
  } catch {
    throw new ApiError(400, "La liste des images à conserver est invalide.");
  }

  if (
    !Array.isArray(requested) ||
    requested.some((url) => typeof url !== "string" || !existingImages.includes(url))
  ) {
    throw new ApiError(400, "La liste des images à conserver est invalide.");
  }

  const keep = new Set(requested);
  return existingImages.filter((url) => keep.has(url));
}

function validate(schema, body) {
  const parsed = schema.safeParse(parseProductBody(body));
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || "Données invalides.");
  }
  return parsed.data;
}

async function uploadFiles(files = []) {
  return Promise.all(files.map((file) => uploadImageBuffer(file.buffer)));
}

export async function listAdminProducts(req, res) {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  res.json(products);
}

export async function getAdminProduct(req, res) {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) throw new ApiError(404, "Produit introuvable.");
  res.json(product);
}

export async function createProduct(req, res) {
  const data = validate(productSchema, req.body || {});
  const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existing) throw new ApiError(409, "Un produit avec ce slug existe déjà.");

  if (!req.files?.length) throw new ApiError(400, "Au moins une image est requise.");
  const images = await uploadFiles(req.files);

  const product = await prisma.product.create({ data: { ...data, images } });
  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const { id } = req.params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Produit introuvable.");

  const data = validate(productUpdateSchema, req.body || {});
  if (data.slug && data.slug !== existing.slug) {
    const slugTaken = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (slugTaken) throw new ApiError(409, "Un produit avec ce slug existe déjà.");
  }

  const existingImages = Array.isArray(existing.images) ? existing.images : [];
  const keptImages = parseKeepImages(req.body?.keepImages, existingImages);
  if (keptImages.length + (req.files?.length || 0) > MAX_IMAGES) {
    throw new ApiError(400, `Un produit ne peut pas avoir plus de ${MAX_IMAGES} images.`);
  }

  const images = [...keptImages, ...(await uploadFiles(req.files))];
  const product = await prisma.product.update({
    where: { id },
    data: { ...data, images },
  });

  res.json(product);
}

export async function deleteProduct(req, res) {
  const { id } = req.params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Produit introuvable.");

  await prisma.product.delete({ where: { id } });
  res.json({ ok: true });
}