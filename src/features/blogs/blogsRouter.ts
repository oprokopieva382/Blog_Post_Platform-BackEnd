import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { postValidationMiddleware } from "../../middlewares/postValidationMiddleware";
import { blogsController } from "./blogsController";

export const postsRouter = Router();

postsRouter.get("/", blogsController.getAll());
// postsRouter.get("/:id", postsController.getById());
// postsRouter.post(
//   "/",
//   authMiddleware,
//   postValidationMiddleware,
//   postsController.create()
// );
// postsRouter.delete("/:id", authMiddleware, postsController.deleteById());
// postsRouter.put(
//   "/:id",
//   authMiddleware,
//   postValidationMiddleware,
//   postsController.update()
// );
