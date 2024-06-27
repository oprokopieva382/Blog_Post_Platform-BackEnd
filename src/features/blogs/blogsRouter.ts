import { Router } from "express";
import { blogsController } from "./BlogsController";
import {
  isAdminMiddleware,
  validatePostOfBlog,
  validateBlog,
} from "../../middlewares";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getAll);

blogsRouter.get("/:id", blogsController.getById);
blogsRouter.get("/:blogId/posts", blogsController.getBlogPosts);

blogsRouter.delete("/:id", isAdminMiddleware, blogsController.deleteById);

blogsRouter.post("/", isAdminMiddleware, validateBlog, blogsController.create);

blogsRouter.post(
  "/:blogId/posts",
  isAdminMiddleware,
  validatePostOfBlog,
  blogsController.createBlogPost
);

blogsRouter.put(
  "/:id",
  isAdminMiddleware,
  validateBlog,
  blogsController.update
);
