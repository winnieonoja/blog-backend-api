import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, "First name is required"]
  },

  lastName: {
    type: String,
    trim: true,
    required: [true, "Last name is required"]
  },

  userName: {
    type: String,
    lowercase: true,
    required: [true, "User name is required"],
    unique: true,
    trim: true
  },

  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, "Email is required"],
    unique: true
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be atleast 6 characters"],
    select: false
  },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

  bio: {
    type: String,
    default: "",
    trim: true
  },

  profileImage: {
    type: String,
    default: "",
  },

  location: {
    type: String,
    default: "",
  },

  joindDate: {
    type: Date,
    default: Date.now,
  },

}, {timestamps:true})

const User = mongoose.model("User", userSchema);

export default User;