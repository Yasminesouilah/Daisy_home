import { Router } from "express";
import { getMe, login } from "../controllers/auth.controller.js";
import {
	createProduct,
	deleteProduct,
	getAdminProduct,
	listAdminProducts,
	updateProduct,
} from "../controllers/admin/product.controller.js";
import {
	getAdminOrder,
	listAdminOrders,
	searchAdminOrders,
	updateOrderStatus,
} from "../controllers/admin/order.controller.js";
import {
	listAdminCategories,
	createCategory,
} from "../controllers/admin/category.controller.js";
import { requireAdmin } from "../middleware/auth.js";
import { writeLimiter } from "../middleware/rateLimit.js";
import { upload } from "../middleware/upload.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/login", writeLimiter, asyncHandler(login));
router.get("/me", requireAdmin, asyncHandler(getMe));

router.get("/products", requireAdmin, asyncHandler(listAdminProducts));
router.get("/products/:id", requireAdmin, asyncHandler(getAdminProduct));
router.post("/products", requireAdmin, upload.array("images", 5), asyncHandler(createProduct));
router.put("/products/:id", requireAdmin, upload.array("images", 5), asyncHandler(updateProduct));
router.delete("/products/:id", requireAdmin, asyncHandler(deleteProduct));

router.get("/categories", requireAdmin, asyncHandler(listAdminCategories));
router.post("/categories", requireAdmin, upload.array("image", 1), asyncHandler(createCategory));

router.get("/orders/search", requireAdmin, asyncHandler(searchAdminOrders));
router.get("/orders", requireAdmin, asyncHandler(listAdminOrders));
router.get("/orders/:id", requireAdmin, asyncHandler(getAdminOrder));
router.patch("/orders/:id/status", requireAdmin, asyncHandler(updateOrderStatus));

export default router;