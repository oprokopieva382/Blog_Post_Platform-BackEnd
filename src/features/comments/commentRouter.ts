import { Router } from "express";
import { commentController } from "./CommentController";
import { isAuthorizedMiddleware, validateComment } from "../../middlewares";

export const commentRouter = Router();

commentRouter.get("/:id", commentController.getById.bind(commentController));
commentRouter.delete(
  "/:commentId",
  isAuthorizedMiddleware,
  commentController.deleteById
);
commentRouter.put(
  "/:commentId",
  isAuthorizedMiddleware,
  validateComment,
  commentController.update
);
