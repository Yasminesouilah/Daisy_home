import { Router } from "express";
import { createOrder } from "../controllers/order.controller.js";
import { writeLimiter } from "../middleware/rateLimit.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/", writeLimiter, asyncHandler(createOrder));

export default router;