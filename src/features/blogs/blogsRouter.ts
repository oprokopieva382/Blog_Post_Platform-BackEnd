import { Router } from "express";
import { blogsController } from "./blogsController";
import {
  authAdminMiddleware,
  blogPostValidationMiddleware,
  blogValidationMiddleware,
} from "../../middlewares";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getAll);

blogsRouter.get("/:id", blogsController.getById);
blogsRouter.get("/:blogId/posts", blogsController.getBlogPosts);

blogsRouter.delete("/:id", authAdminMiddleware, blogsController.deleteById);

blogsRouter.post(
  "/",
  authAdminMiddleware,
  blogValidationMiddleware,
  blogsController.create
);

blogsRouter.post(
  "/:blogId/posts",
  authAdminMiddleware,
  blogPostValidationMiddleware,
  blogsController.createBlogPost
);

blogsRouter.put(
  "/:id",
  authAdminMiddleware,
  blogValidationMiddleware,
  blogsController.update
);
