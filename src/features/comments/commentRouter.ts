import { Router } from "express";
import { CommentController } from "./CommentController";
import { isAuthorizedMiddleware, validateComment } from "../../middlewares";

export const commentRouter = Router();
const commentController = new CommentController();

commentRouter.get("/:id", commentController.getById.bind(commentController));
commentRouter.delete(
  "/:commentId",
  isAuthorizedMiddleware,
  commentController.deleteById.bind(commentController)
);
commentRouter.put(
  "/:commentId",
  isAuthorizedMiddleware,
  validateComment,
  commentController.update.bind(commentController)
);
