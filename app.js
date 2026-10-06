import express from "express";
import cors from "cors";
import authRoutes from "../backend_blog_project/routes/auth.routes.js";
import commentRoutes from "../backend_blog_project/routes/comment.routes.js"
import postRoutes from "../backend_blog_project/routes/post.routes.js";
import userRoutes from "../backend_blog_project/routes/user.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.get("/", (req,res) =>{
  res.status(200).json({message: "Welcome to the Node.js MYQL API"});
})

// RENDER ROUTES
app.use('/api/users', userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/post", postRoutes);

app.use(errorMiddleware);


export default app;