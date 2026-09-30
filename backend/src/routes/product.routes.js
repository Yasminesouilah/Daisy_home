import { Router } from "express";
import {
  getProductBySlug,
  getRelatedProducts,
  listProducts,
} from "../controllers/product.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listProducts));
router.get("/:slug", asyncHandler(getProductBySlug));
router.get("/:slug/related", asyncHandler(getRelatedProducts));

export default router;