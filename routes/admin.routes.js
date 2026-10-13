import express from "express";
import { getDashboardStats,   getAllUsers } from "../controllers/admin.controller.js";

import { authMiddleware, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET ADMIN DASHBOARD STATISTICS
router.get( "/dashboard", authMiddleware, authorizeRoles("admin"), getDashboardStats);
// GET ALL USERS
router.get( "/users", authMiddleware, authorizeRoles("admin"), getAllUsers );

export default router;