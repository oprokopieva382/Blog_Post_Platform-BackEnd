import { Router } from "express";
import { isAuthorizedMiddleware, validateComment } from "../../middlewares";
import { commentController } from "../../composition-root";

export const commentRouter = Router();

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
