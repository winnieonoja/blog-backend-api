import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import { sendError, sendSuccess } from "../utils/response.js";

dotenv.config();

export const authMiddleware = (req, res, next)=>{
  try{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
      return sendError(
              res,
              401,
              "Authentication required"
            );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next();
  }catch(error){
    console.error("Authentication error: ", error)

        if(error.name === "JsonWebTokenError"){
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        })
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.userId) {
        return sendError(
          res,
          401,
          "Authentication required"
        );
      }

      const user = await User.findById(req.userId);
      
      if (!user) {
        return sendError(res, 401, "User not found");
      }

      if (!allowedRoles.includes(user.role)) {
        return sendError(
          res,
          403,
          "You do not have permission to perform this action"
        );
      }

      req.userRole = user.role;

      next();

    } catch (error) {
      return sendError(
        res,
        500,
        "Authorization failed",
        error.message
      );
    }
  };
};