import { prisma } from "../../lib/prisma.js";
import { categorySchema } from "../../validators/category.validator.js";
import { uploadImageBuffer } from "../../utils/uploadImage.js";
import { ApiError } from "../../utils/ApiError.js";

export async function listAdminCategories(req, res) {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  res.json(categories);
}

export async function createCategory(req, res) {
  const parsed = categorySchema.safeParse(req.body || {});
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || "Données invalides.");
  }

  const existing = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) throw new ApiError(409, "Une catégorie avec ce slug existe déjà.");

  const file = req.files?.[0];
  if (!file) throw new ApiError(400, "Une image est requise pour la catégorie.");

  const image = await uploadImageBuffer(file.buffer, "daisyhome/categories");

  const category = await prisma.category.create({ data: { ...parsed.data, image } });
  res.status(201).json(category);
}