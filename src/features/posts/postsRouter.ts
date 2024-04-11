import { Router } from "express";
import { postsController } from "./postsController";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { postValidationMiddleware } from "../../middlewares/postValidationMiddleware";

export const postsRouter = Router();

postsRouter.get(
  "/",
  async (req, res) => await postsController.getAll(req, res)
);
postsRouter.get(
  "/:id",
  async (req, res) => await postsController.getById(req, res)
);
postsRouter.post(
  "/",
  authMiddleware,
  postValidationMiddleware,
  async (req, res) => await postsController.create(req, res)
);
postsRouter.delete(
  "/:id",
  authMiddleware,
  async (req, res) => await postsController.deleteById(req, res)
);
// postsRouter.put(
//   "/:id",
//   authMiddleware,
//   postValidationMiddleware,
//   postsController.update()
// );
