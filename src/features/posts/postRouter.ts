import { Router } from "express";
import { PostController } from "./PostController";
import {
  isAdminMiddleware,
  isAuthorizedMiddleware,
  validateComment,
  validatePost,
} from "../../middlewares";

export const postRouter = Router();
const postController = new PostController();

postRouter.get("/", postController.getAll.bind(postController));
postRouter.get("/:id", postController.getById.bind(postController));
postRouter.post(
  "/",
  isAdminMiddleware,
  validatePost,
  postController.create.bind(postController)
);
postRouter.delete(
  "/:id",
  isAdminMiddleware,
  postController.deleteById.bind(postController)
);
postRouter.put(
  "/:id",
  isAdminMiddleware,
  validatePost,
  postController.update.bind(postController)
);
postRouter.get(
  "/:postId/comments",
  postController.getPostComments.bind(postController)
);
postRouter.post(
  "/:postId/comments",
  isAuthorizedMiddleware,
  validateComment,
  postController.createPostComment.bind(postController)
);
