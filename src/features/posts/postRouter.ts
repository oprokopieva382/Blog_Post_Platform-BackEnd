import { Router } from "express";
import { postController } from "./PostController";
import {
  isAdminMiddleware,
  isAuthorizedMiddleware,
  validateComment,
  validatePost,
} from "../../middlewares";

export const postRouter = Router();

postRouter.get("/", postController.getAll.bind(postController));
postRouter.get("/:id", postController.getById.bind(postController));
postRouter.post("/", isAdminMiddleware, validatePost, postController.create);
postRouter.delete("/:id", isAdminMiddleware, postController.deleteById);
postRouter.put("/:id", isAdminMiddleware, validatePost, postController.update);
postRouter.get("/:postId/comments", postController.getPostComments);
postRouter.post(
  "/:postId/comments",
  isAuthorizedMiddleware,
  validateComment,
  postController.createPostComment
);
