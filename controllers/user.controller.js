import User from "../models/user.model.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    return sendSuccess(
      res,
      200,
      "Profile retrieved successfully",
      user
    );
  } catch (error) {
    console.error("Get profile error:", error);

    return sendError(
      res,
      500,
      "Failed to retrieve profile",
      error.message
    );
  }
};