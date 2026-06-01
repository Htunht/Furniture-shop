import express from "express";
import multer from "multer";
import * as productController from "../controller/api/productController";
import * as orderController from "../controller/api/orderController";
import { authGuard, optionalAuth } from "../middleware/auth";

const router = express.Router();

// Multer disk storage configuration for KPay slips
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/products", optionalAuth, productController.getProducts);
router.post("/products/favorite", authGuard, productController.toggleFavorite);
router.get("/orders", authGuard, orderController.getOrders);
router.post("/order/confirm", optionalAuth, upload.single("slip"), orderController.sendOrderConfirmation);
router.get("/order/track/:orderNumber", orderController.trackOrder);

export default router;
 