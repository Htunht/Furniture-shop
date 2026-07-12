import express from "express";
import { upload } from "../lib/cloudinary";
import * as productAdminController from "../controller/admin/productController";
import * as dashboardController from "../controller/admin/adminDashboardController";
import { authGuard, adminGuard } from "../middleware/auth";

const router = express.Router();

// Apply admin guard to all routes in this router
router.use(authGuard);
router.use(adminGuard);

router.post("/products/create", upload.single("image"), productAdminController.createProduct);
router.patch("/products/:id", upload.single("image"), productAdminController.updateProduct);
router.get("/products", dashboardController.getProducts);
router.delete("/products/:id", dashboardController.deleteProduct);

router.get("/stats", dashboardController.getDashboardStats);
router.get("/orders", dashboardController.getOrders);
router.patch("/orders/:id", dashboardController.updateOrderStatus);
router.get("/users", dashboardController.getUsers);

export default router;
