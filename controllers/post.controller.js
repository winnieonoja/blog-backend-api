import cors from "cors";
import Post from "../models/post.model.js";
import {sendError, sendSuccess} from "../utils/response.js"
import { authMiddleware } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

//CREATE POST
export const createPost = async (req, res)=>{
    try {
        const { title, content } = req.body;

        const post = await Post.create({
            title,
            content,
            image: req.file ?
             { 
                url: req.file.path,
                public_id: req.file.filename
            } : null,
            author: req.userId
        })

        return sendSuccess(
          res,
          201,
          "Post created successfully",
          post
        );
    } catch (error) {
      console.error("Create post error:", error);
        
          return sendError(
            res,
            500,
            "Failed to create post",
            error.message
          );
    }
}

// GET ALL POST
export const getAllPost = async (req, res)=>{
    try {
       const posts = await Post.find().populate("author", "userName email").sort({ createdAt: -1 });
       const totalPosts = await Post.countDocuments();
        return sendSuccess(
          res,
          200,
          "Post fetched successfully",
          {
            totalPosts,
            posts
          }
        );
    } catch (error) {
      console.error("Error fetching all post:", error);
  
       return sendError(
            res,
            500,
            "Failed to fetch all post",
            error.message
          );
    }
}

// GET ALL POSTS BY A PARTICULAR USER
export const allUserPost = async (req, res) => {
  try {
    const { userId } = req.params;

    const userPost = await Post.find({ author: userId })
      .populate("author", "userName email")
      .sort({ createdAt: -1 });

    const totalUserPost = await Post.countDocuments({
      author: userId
    });

    return sendSuccess(
      res,
      200,
      "User posts fetched successfully",
      {
        userPost,
        totalUserPost
      }
    );

  } catch (error) {
    console.error("Unable to get all user posts:", error);

    return sendError(
      res,
      500,
      "Failed to get user posts",
      error.message
    );
  }
};

// SINGLE POST
export const getSinglePost = async (req, res)=>{
    try {
       const post = await Post.findById(req.params.id).populate("author", "userName email");

       if(!post) 

       return sendError(
            res,
            404,
            "Post not found" 
          );

          return sendSuccess(
          res,
          200,
          "Post fetched successfully",
          post
        );

    } catch (error) {
      console.error("Fetch single post error:", error);
        return sendError(
            res,
            500,
            "Failed to fetch sinfle post",
            error.message
          );
    }
}

// DELETE POST
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post
    const post = await Post.findById(postId);

    if (!post) {
      return sendError(res, 404, "Post not found");
    }

    // Find the logged-in user
    const user = await User.findById(req.userId);

    if (!user) {
      return sendError(res, 401, "User not found");
    }

    // Admin can delete any post
    if (user.role === "admin") {
      await Post.findByIdAndDelete(postId);

      return sendSuccess(
        res,
        200,
        "Post deleted successfully"
      );
    }

    // Normal user can delete only their own post
    if (post.author.toString() !== req.userId.toString()) {
      return sendError(
        res,
        403,
        "You can only delete your own posts"
      );
    }

    await Post.findByIdAndDelete(postId);

    return sendSuccess(
      res,
      200,
      "Post deleted successfully"
    );

  } catch (error) {
    console.error("Delete post error:", error);

    return sendError(
      res,
      500,
      "Failed to delete post",
      error.message
    );
  }
};

// UPDATE POST

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return sendError(res, 404, "Post not found");
    }

    if (
      req.userRole !== "admin" &&
      post.author.toString() !== req.userId.toString()
    ) {
      return sendError(res, 403, "You can only update your own posts");
    }

    if (title !== undefined) {
      post.title = title;
    }

    if (content !== undefined) {
      post.content = content;
    }

    if (req.file) {
      if (post.image?.public_id) {
        await cloudinary.uploader.destroy(post.image.public_id);
      }

      post.image = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const updatedPost = await post.save();

    return sendSuccess(
      res,
      200,
      "Post updated successfully",
      updatedPost
    );

  } catch (error) {
    console.error("Update post error:", error);

    return sendError(
      res,
      500,
      "Failed to update post",
      error.message
    );
  }
};


// LIKE POST
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return sendError(res, 404, "Post not found");
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      return sendError(res, 400, "You already liked this post");
    }

    // Add user to likes
    post.likes.push(userId);

    // Remove user from dislikes if present
    post.dislikes = post.dislikes.filter(
      (id) => id.toString() !== userId.toString()
    );

    await post.save();

    return sendSuccess(
      res,
      200,
      "Post liked successfully",
      post
    );

  } catch (error) {
    console.error("Like post error:", error);

    return sendError(
      res,
      500,
      "Failed to like post",
      error.message
    );
  }
};

// DISLIKE POST
export const dislikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return sendError(res, 404, "Post not found");
    }

    const alreadyDisliked = post.dislikes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyDisliked) {
      return sendError(res, 400, "You already disliked this post");
    }

    // Add user to dislikes
    post.dislikes.push(userId);

    // Remove user from likes if present
    post.likes = post.likes.filter(
      (id) => id.toString() !== userId.toString()
    );

    await post.save();

    return sendSuccess(
      res,
      200,
      "Post disliked successfully",
      post
    );

  } catch (error) {
    console.error("Dislike post error:", error);

    return sendError(
      res,
      500,
      "Failed to dislike post",
      error.message
    );
  }
};