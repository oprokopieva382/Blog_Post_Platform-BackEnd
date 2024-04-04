import { Router } from "express";
import { postsController } from "./postsController";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { postValidationMiddleware } from "../../middlewares/postValidationMiddleware";

export const postsRouter = Router();

postsRouter.get("/", postsController.getAll());
postsRouter.get("/:id", postsController.getById());
postsRouter.post(
  "/",
  authMiddleware,
  postValidationMiddleware,
  postsController.create()
);
postsRouter.delete("/:id", authMiddleware, postsController.deleteById());
postsRouter.put(
  "/:id",
  authMiddleware,
  postValidationMiddleware,
  postsController.update()
);
