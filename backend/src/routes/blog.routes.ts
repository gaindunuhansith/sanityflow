import { Router } from "express";
import auth, { requireRole } from "../middleware/auth.js";
import { createBlogPostHandler, deleteBlogPostHandler, getAllBlogPostsHandler, getBlogPostByIdHandler, updateBlogPostHandler } from "../controllers/blog.controllers.js";
import { blogCoverImageUpload } from "../middleware/blogImageUpload.middleware.js";

const blogRouter = Router();

blogRouter.get("/", getAllBlogPostsHandler);
blogRouter.get("/:id", getBlogPostByIdHandler);
blogRouter.post("/", auth, requireRole('admin'), blogCoverImageUpload, createBlogPostHandler);
blogRouter.patch("/:id", auth, requireRole('admin'), blogCoverImageUpload, updateBlogPostHandler);
blogRouter.delete("/:id", auth, requireRole('admin'), deleteBlogPostHandler);

export default blogRouter;