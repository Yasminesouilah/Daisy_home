import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import app from "./app.js";

async function start() {
  await prisma.$connect();
  console.log("Database connected (via Prisma)");

  app.listen(env.port, () => {
    console.log(`Daisy Home API running on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});