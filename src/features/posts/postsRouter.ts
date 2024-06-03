import { Router } from "express";
import { postsController } from "./postsController";
import {
  isAdminMiddleware,
  isAuthorizedMiddleware,
  commentValidationMiddleware,
  postValidationMiddleware,
} from "../../middlewares";

export const postsRouter = Router();

postsRouter.get("/", postsController.getAll);
postsRouter.get("/:id", postsController.getById);
postsRouter.post(
  "/",
  isAdminMiddleware,
  postValidationMiddleware,
  postsController.create
);
postsRouter.delete("/:id", isAdminMiddleware, postsController.deleteById);
postsRouter.put(
  "/:id",
  isAdminMiddleware,
  postValidationMiddleware,
  postsController.update
);
postsRouter.get("/:postId/comments", postsController.getPostComments);
postsRouter.post(
  "/:postId/comments",
  isAuthorizedMiddleware,
  commentValidationMiddleware,
  postsController.createPostComment
);
