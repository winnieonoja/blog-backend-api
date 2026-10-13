import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

import {
  sendSuccess,
  sendError
} from "../utils/response.js";


// GET DASHBOARD STATISTICS
export const getDashboardStats = async (req, res) => {
  try {

    // Total users
    const totalUsers = await User.countDocuments();

    // Total posts
    const totalPosts = await Post.countDocuments();

    // Total comments
    const totalComments = await Comment.countDocuments();

    // Total likes
    const posts = await Post.find().select("likes");

    const totalLikes = posts.reduce(
      (total, post) => total + post.likes.length,
      0
    );

    // Five most recent posts
    const recentPosts = await Post.find()
      .populate("author", "userName")
      .sort({ createdAt: -1 })
      .limit(5);

    return sendSuccess(
      res,
      200,
      "Dashboard statistics fetched successfully",
      {
        totalUsers,
        totalPosts,
        totalComments,
        totalLikes,
        recentPosts
      }
    );

  } catch (error) {

    console.error("Admin dashboard error:", error);

    return sendError(
      res,
      500,
      "Failed to fetch dashboard statistics",
      error.message
    );
  }
};

// GET ALL REGISTERED USERS
export const getAllUsers = async (req, res) => {
  try {

    const users = await User.find()
      .select("firstName lastName userName email role createdAt")
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments();

    return sendSuccess(
      res,
      200,
      "Users fetched successfully",
      {
        totalUsers,
        users
      }
    );

  } catch (error) {

    console.error("Get all users error:", error);

    return sendError(
      res,
      500,
      "Failed to fetch users",
      error.message
    );
  }
};