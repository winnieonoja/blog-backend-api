import mongoose from "mongoose";
import User from "./user.model.js"

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  image: {
    url: {type: String, default: null},
    public_id: {type: String, default: null}
  },

  author: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User"
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
       ref: "User"
      }
    ],

  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User"
    }
  ]
  
}, {timestamps: true})

const Post = mongoose.model("Post", postSchema);

export default Post;