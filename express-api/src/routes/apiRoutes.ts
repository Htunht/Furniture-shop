import express from "express";
import { upload } from "../lib/cloudinary";
import * as productController from "../controller/api/productController";
import * as orderController from "../controller/api/orderController";
import { authGuard, optionalAuth } from "../middleware/auth";

const router = express.Router();

// ပုံတင်ရန် Route သတ်မှတ်ခြင်း ('image' ဆိုသည်မှာ Frontend မှ ပို့မည့် field name ဖြစ်သည်)
router.post("/upload", upload.single("image"), (req: express.Request, res: express.Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image provided" });
  }
  
  return res.json({ 
    message: "Image uploaded successfully", 
    imageUrl: req.file.path 
  });
});

router.get("/products", optionalAuth, productController.getProducts);
router.post("/products/favorite", authGuard, productController.toggleFavorite);
router.get("/orders", authGuard, orderController.getOrders);
router.post("/order/confirm", optionalAuth, upload.single("slip"), orderController.sendOrderConfirmation);
router.get("/order/track/:orderNumber", orderController.trackOrder);

export default router;
 