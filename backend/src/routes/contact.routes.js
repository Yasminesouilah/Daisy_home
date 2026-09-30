import { Router } from "express";
import { sendMessage } from "../controllers/contact.controller.js";
import { writeLimiter } from "../middleware/rateLimit.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/", writeLimiter, asyncHandler(sendMessage));

export default router;