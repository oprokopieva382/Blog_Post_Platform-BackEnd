import { Router } from "express";
import { commentsController } from "./CommentsController";
import { isAuthorizedMiddleware, validateComment } from "../../middlewares";

export const commentsRouter = Router();

commentsRouter.get("/:id", commentsController.getById);
commentsRouter.delete(
  "/:commentId",
  isAuthorizedMiddleware,
  commentsController.deleteById
);
commentsRouter.put(
  "/:commentId",
  isAuthorizedMiddleware,
  validateComment,
  commentsController.update
);
