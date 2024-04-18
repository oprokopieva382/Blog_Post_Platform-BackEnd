import { Router } from "express";
import { blogsController } from "./blogsController";
import {
  authMiddleware,
  blogPostValidationMiddleware,
  blogValidationMiddleware,
} from "../../middlewares";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getAll);

blogsRouter.get("/:id", blogsController.getById);
blogsRouter.get("/:blogId/posts", blogsController.getBlogPosts);

blogsRouter.delete("/:id", authMiddleware, blogsController.deleteById);

blogsRouter.post(
  "/",
  authMiddleware,
  blogValidationMiddleware,
  blogsController.create
);

blogsRouter.post(
  "/:blogId/posts",
  authMiddleware,
  blogPostValidationMiddleware,
  blogsController.createBlogPost
);

blogsRouter.put(
  "/:id",
  authMiddleware,
  blogValidationMiddleware,
  blogsController.update
);
