import { prisma } from "../lib/prisma.js";

export async function listCategories(req, res) {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { name: true, slug: true, image: true },
  });
  res.json(categories);
}