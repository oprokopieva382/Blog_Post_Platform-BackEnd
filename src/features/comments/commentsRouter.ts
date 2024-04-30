import { Router } from "express";
import { commentsController } from "./commentsController";
import { authMiddleware, commentValidationMiddleware } from "../../middlewares";

export const commentsRouter = Router();

commentsRouter.get("/:id", commentsController.getById);
commentsRouter.delete(
  "/:commentId",
  authMiddleware,
  commentsController.deleteById
);
commentsRouter.put(
  "/:commentId",
  authMiddleware,
  commentValidationMiddleware,
  commentsController.update
);
