import express from "express";
import multer from "multer";
import * as productController from "../controller/api/productController";
import * as orderController from "../controller/api/orderController";
import { authGuard, optionalAuth } from "../middleware/auth";

const router = express.Router();

// Multer memory storage configuration for KPay slips
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.get("/products", optionalAuth, productController.getProducts);
router.post("/products/favorite", authGuard, productController.toggleFavorite);
router.get("/orders", authGuard, orderController.getOrders);
router.post("/order/confirm", optionalAuth, upload.single("slip"), orderController.sendOrderConfirmation);
router.get("/order/track/:orderNumber", orderController.trackOrder);

export default router;
 