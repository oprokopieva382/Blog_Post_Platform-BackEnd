import { Router } from "express";
import {
  isAuthorizedMiddleware,
  softAccessMiddleware,
  validateComment,
  validateReaction,
} from "../../middlewares";
import { commentController } from "../../composition-root";

export const commentRouter = Router();

commentRouter.get(
  "/:id",
  softAccessMiddleware,
  commentController.getById.bind(commentController)
);
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
commentRouter.put(
  "/:commentId/like-status",
  isAuthorizedMiddleware,
  validateReaction,
  commentController.reactToComment.bind(commentController)
);
