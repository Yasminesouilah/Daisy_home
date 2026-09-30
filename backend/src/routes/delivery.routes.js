import { Router } from "express";
import { getDeliveryFees } from "../controllers/delivery.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/fees", asyncHandler(getDeliveryFees));

export default router;