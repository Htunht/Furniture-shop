import express from "express";
import adminRoute from "./adminRoutes";
import apiRoute from "./apiRoutes";
import { authGuard, adminGuard } from "../middleware/auth";

const router = express.Router();

router.use("/api/v1/admin", adminGuard, adminRoute);
router.use("/api/v1", apiRoute);

export default router;
