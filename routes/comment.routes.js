import express from "express";
import { createComment, getPostComments, updateComment, deleteComment } from "../controllers/comment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:postId", authMiddleware, createComment);
router.get("/:postId", getPostComments),
router.patch("/:commentId", authMiddleware, updateComment);
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;