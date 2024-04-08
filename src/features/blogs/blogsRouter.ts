import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { blogsController } from "./blogsController";
import { blogValidationMiddleware } from "../../middlewares/blogValidationMiddleware";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getAll());
blogsRouter.get("/:id", blogsController.getById());
blogsRouter.post(
  "/",
  authMiddleware,
  blogValidationMiddleware,
  blogsController.create()
);
blogsRouter.delete("/:id", authMiddleware, blogsController.deleteById());
blogsRouter.put(
  "/:id",
  authMiddleware,
  blogValidationMiddleware,
  blogsController.update()
);
