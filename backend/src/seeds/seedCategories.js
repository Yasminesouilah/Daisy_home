import { prisma } from "../lib/prisma.js";
import { CATEGORIES } from "../../../frontend/src/data/categories.js";

async function seed() {
  const real = CATEGORIES.filter((c) => !c.virtual);

  for (const c of real) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { name: c.name, slug: c.slug, image: c.image },
    });
  }

  const total = await prisma.category.count();
  console.log(`Seed complete. ${total} categories in the database.`);
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());