import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import app from "./app.js";

async function start() {
  try {
    // Connect to the database
    await prisma.$connect();
    console.log("Database connected (via Prisma)");

    // Start the Express server
    app.listen(env.port, "0.0.0.0", () => {
      console.log(
        `Daisy Home API running on port ${env.port} (${env.nodeEnv})`
      );
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();