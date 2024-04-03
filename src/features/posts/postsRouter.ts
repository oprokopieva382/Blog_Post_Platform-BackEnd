import { Router } from "express";
import { postsController } from "./postsController";
import { authMiddleware } from "../../middlewares/authMiddleware";

export const postsRouter = Router();

postsRouter.get("/", postsController.getAll());
postsRouter.get("/:id", postsController.getById());
postsRouter.post("/", authMiddleware, postsController.create());
postsRouter.delete("/:id", authMiddleware, postsController.deleteById());
postsRouter.put("/:id", authMiddleware, postsController.update());
