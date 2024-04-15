import { Router } from "express";
import { blogsController } from "./blogsController";
import { authMiddleware, blogValidationMiddleware } from "../../middlewares";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getAll);

blogsRouter.get("/:id", blogsController.getById);
blogsRouter.get("/:blogId/posts", blogsController.getById);

blogsRouter.delete("/:id", authMiddleware, blogsController.deleteById);

blogsRouter.post(
  "/",
  authMiddleware,
  blogValidationMiddleware,
  blogsController.create
);

blogsRouter.put(
  "/:id",
  authMiddleware,
  blogValidationMiddleware,
  blogsController.update
);
