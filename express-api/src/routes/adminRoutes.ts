import express from "express";
import multer from "multer";
import * as productAdminController from "../controller/admin/productController";
import * as dashboardController from "../controller/admin/adminDashboardController";
import { authGuard, adminGuard } from "../middleware/auth";

const router = express.Router();

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
