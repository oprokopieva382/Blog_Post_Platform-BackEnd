import { Router} from "express";
import { postsController } from "./postsController";
import { authAdminMiddleware, authMiddleware, postValidationMiddleware } from "../../middlewares";

export const postsRouter = Router();

postsRouter.get("/", postsController.getAll);
postsRouter.get("/:id", postsController.getById);
postsRouter.post(
  "/",
  authMiddleware,
  postValidationMiddleware,
  postsController.create
);
postsRouter.delete("/:id", authAdminMiddleware, postsController.deleteById);
postsRouter.put(
  "/:id",
  authAdminMiddleware,
  postValidationMiddleware,
  postsController.update
);
postsRouter.get("/:postId/comments", postsController.getPostComments)
postsRouter.post("/:postId/comments", postsController.createPostComment);
