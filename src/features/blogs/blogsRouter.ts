import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { postValidationMiddleware } from "../../middlewares/postValidationMiddleware";
import { blogsController } from "./blogsController";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getAll());
blogsRouter.get("/:id", blogsController.getById());
blogsRouter.post(
  "/",
  blogsController.create()
);
blogsRouter.delete("/:id", blogsController.deleteById());
// blogsRouter.put(
//   "/:id",
//   authMiddleware,
//   postValidationMiddleware,
//   postsController.update()
// );
