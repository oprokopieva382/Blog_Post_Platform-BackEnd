import { Router} from "express";
import { postsController } from "./postsController";
import { authMiddleware, postValidationMiddleware } from "../../middlewares";

export const postsRouter = Router();

postsRouter.get("/", postsController.getAll);
postsRouter.get("/:id", postsController.getById);
postsRouter.post(
  "/",
  authMiddleware,
  postValidationMiddleware,
  postsController.create
);
postsRouter.delete("/:id", authMiddleware, postsController.deleteById);
postsRouter.put(
  "/:id",
  authMiddleware,
  postValidationMiddleware,
  postsController.update
);
postsRouter.get("/:postId/comments", )
