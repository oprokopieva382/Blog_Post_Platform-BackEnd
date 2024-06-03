import { Router } from "express";
import { blogsController } from "./blogsController";
import {
  isAdminMiddleware,
  blogPostValidationMiddleware,
  blogValidationMiddleware,
} from "../../middlewares";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getAll);

blogsRouter.get("/:id", blogsController.getById);
blogsRouter.get("/:blogId/posts", blogsController.getBlogPosts);

blogsRouter.delete("/:id", isAdminMiddleware, blogsController.deleteById);

blogsRouter.post(
  "/",
  isAdminMiddleware,
  blogValidationMiddleware,
  blogsController.create
);

blogsRouter.post(
  "/:blogId/posts",
  isAdminMiddleware,
  blogPostValidationMiddleware,
  blogsController.createBlogPost
);

blogsRouter.put(
  "/:id",
  isAdminMiddleware,
  blogValidationMiddleware,
  blogsController.update
);
