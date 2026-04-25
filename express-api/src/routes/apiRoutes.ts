import express from "express";
import * as productController from "../controller/api/productController";
import * as orderController from "../controller/api/orderController";
import { authGuard, optionalAuth } from "../middleware/auth";

const router = express.Router();

router.get("/products", optionalAuth, productController.getProducts);
router.post("/products/favorite", authGuard, productController.toggleFavorite);
router.post("/order/confirm", orderController.sendOrderConfirmation);

export default router;
