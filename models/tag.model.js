import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({}, {timestamps:true})

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;