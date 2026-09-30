import { prisma } from "../lib/prisma.js";
import { PRODUCTS } from "../../../frontend/src/data/products.js";

async function seed() {
  const force = process.argv.includes("--force");

  if (force) {
    await prisma.product.deleteMany({});
    console.log("Existing products deleted (--force).");
  }

  for (const { id, createdAt, ...rest } of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: rest.slug },
      update: {},
      create: {
        ...rest,
        ...(createdAt ? { createdAt: new Date(createdAt) } : {}),
      },
    });
  }

  const total = await prisma.product.count();
  console.log(`Seed complete. ${total} products in the database.`);
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());