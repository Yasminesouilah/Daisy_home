import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

const EMAIL = process.argv[2]?.trim().toLowerCase();
const PASSWORD = process.argv[3];

async function seed() {
  if (!EMAIL || !PASSWORD) {
    console.error("Usage: npm run seed:admin -- <email> <password>");
    process.exitCode = 1;
    return;
  }

  if (PASSWORD.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exitCode = 1;
    return;
  }

  const existing = await prisma.admin.findUnique({ where: { email: EMAIL } });
  if (existing) {
    console.log(`Admin with email ${EMAIL} already exists. Skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(PASSWORD, 12);
  await prisma.admin.create({ data: { email: EMAIL, passwordHash } });

  console.log(`Admin created: ${EMAIL}`);
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());