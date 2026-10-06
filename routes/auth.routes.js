import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import {authMiddleware, authorizeRoles} from "../middleware/auth.middleware.js"
import { sendSuccess } from "../utils/response.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// router.get("/me", protect, (req,res) =>{
//   return sendSuccess(
//     res,
//     200,
//     "Authentication successful",
//     {userId: req.userId}
//   );
// });

router.get("/me", (req, res) => {
  res.status(200).json({
    message: "ME route is working",
  });
});


router.get("/admin-test", authMiddleware, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({
    message: "Admin access granted",
    userId: req.userId,
    role: req.userRole,
  });
});

export default router;