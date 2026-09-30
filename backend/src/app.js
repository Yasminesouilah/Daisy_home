import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import contactRoutes from "./routes/contact.routes.js";
import deliveryRoutes from "./routes/delivery.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import { publicLimiter } from "./middleware/rateLimit.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json());
app.use(publicLimiter);
if (env.nodeEnv !== "production") app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, env: env.nodeEnv });
});

app.use("/api/products", productRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

export default app;