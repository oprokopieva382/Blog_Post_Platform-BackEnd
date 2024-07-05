import { Router } from "express";
import {
  isAuthorizedMiddleware,
  validateComment,
  validateCommentReaction,
} from "../../middlewares";
import { commentController } from "../../composition-root";
import { softAccessMiddleware } from "../../middlewares/softAccessMiddleware";

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
  validateCommentReaction,
  commentController.reactToComment.bind(commentController)
);
