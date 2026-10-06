import express from 'express';
import { createPost, getAllPost, allUserPost, getSinglePost, deletePost, updatePost, likePost, dislikePost } from '../controllers/post.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post('/', authMiddleware, upload.single("image"), createPost);
router.get('/all-post', getAllPost);
router.get('/:id', getSinglePost);
router.delete("/:postId", authMiddleware, deletePost);
router.patch("/:postId", authMiddleware, upload.single("image"), updatePost);
router.patch("/like/:postId", authMiddleware, likePost);
router.patch("/dislike/:postId", authMiddleware, dislikePost);

// get all post by a user
router.get("/user/:userId", allUserPost);

export default router