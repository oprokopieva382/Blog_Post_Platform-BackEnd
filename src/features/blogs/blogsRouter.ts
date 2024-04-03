import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { blogsController } from "./blogsController";
import { putValidationMiddleware } from "../../middlewares/putValidationMiddleware";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getAll());
blogsRouter.get("/:id", blogsController.getById());
blogsRouter.post(
  "/",
  authMiddleware,
  putValidationMiddleware,
  blogsController.create()
);
blogsRouter.delete("/:id", blogsController.deleteById());
blogsRouter.put(
  "/:id",
  authMiddleware,
  putValidationMiddleware,
  blogsController.update()
);
