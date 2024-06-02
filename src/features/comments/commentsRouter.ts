import { Router } from "express";
import { commentsController } from "./commentsController";
import {
  isAuthorizedMiddleware,
  commentValidationMiddleware,
} from "../../middlewares";

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
  commentValidationMiddleware,
  commentsController.update
);
