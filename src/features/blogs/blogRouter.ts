import { Router } from "express";
import { blogController } from "./BlogController";
import {
  isAdminMiddleware,
  validatePostOfBlog,
  validateBlog,
} from "../../middlewares";

export const blogRouter = Router();

blogRouter.get("/", blogController.getAll.bind(blogController));

blogRouter.get("/:id", blogController.getById.bind(blogController));
blogRouter.get(
  "/:blogId/posts",
  blogController.getBlogPosts.bind(blogController)
);

blogRouter.delete("/:id", isAdminMiddleware, blogController.deleteById);

blogRouter.post("/", isAdminMiddleware, validateBlog, blogController.create);

blogRouter.post(
  "/:blogId/posts",
  isAdminMiddleware,
  validatePostOfBlog,
  blogController.createBlogPost
);

blogRouter.put("/:id", isAdminMiddleware, validateBlog, blogController.update);
