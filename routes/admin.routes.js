import express from "express";

import { getDashboardStats } from "../controllers/admin.controller.js";

import {
  authMiddleware,
  authorizeRoles
} from "../middleware/auth.middleware.js";

const router = express.Router();

// GET ADMIN DASHBOARD STATISTICS
router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles("admin"),
  getDashboardStats
);

export default router;