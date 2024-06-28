import { Router } from "express";
import { blogController } from "./BlogController";
import {
  isAdminMiddleware,
  validatePostOfBlog,
  validateBlog,
} from "../../middlewares";

export const blogRouter = Router();

blogRouter.get("/", blogController.getAll);

blogRouter.get("/:id", blogController.getById);
blogRouter.get("/:blogId/posts", blogController.getBlogPosts);

blogRouter.delete("/:id", isAdminMiddleware, blogController.deleteById);

blogRouter.post("/", isAdminMiddleware, validateBlog, blogController.create);

blogRouter.post(
  "/:blogId/posts",
  isAdminMiddleware,
  validatePostOfBlog,
  blogController.createBlogPost
);

blogRouter.put("/:id", isAdminMiddleware, validateBlog, blogController.update);
