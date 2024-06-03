import { Router } from "express";
import { postsController } from "./postsController";
import {
  isAdminMiddleware,
  isAuthorizedMiddleware,
  validateComment,
  validatePost,
} from "../../middlewares";

export const postsRouter = Router();

postsRouter.get("/", postsController.getAll);
postsRouter.get("/:id", postsController.getById);
postsRouter.post("/", isAdminMiddleware, validatePost, postsController.create);
postsRouter.delete("/:id", isAdminMiddleware, postsController.deleteById);
postsRouter.put(
  "/:id",
  isAdminMiddleware,
  validatePost,
  postsController.update
);
postsRouter.get("/:postId/comments", postsController.getPostComments);
postsRouter.post(
  "/:postId/comments",
  isAuthorizedMiddleware,
  validateComment,
  postsController.createPostComment
);
