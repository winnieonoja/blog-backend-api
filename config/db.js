import mongoose from "mongoose";
import env from "dotenv";
import dns from "node:dns";

env.config();

 const connectDB = async () => {
  try{
    if(process.env.isPubicDns){
      dns.setServers(['8.8.8.8', '8.8.4.4'])
    }
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("✅ MongoDB connected successfully")
  }catch(error){
    console.error("DB connection failed:", error.message);
    process.exit(1)
  }
}

export default connectDB;