import { Router } from "express";
import { usersController } from "./usersController";

export const usersRouter = Router();

usersRouter.get("/", usersController.getAll);

usersRouter.post("/", usersController.create);
// blogsRouter.delete("/:id", authMiddleware, blogsController.deleteById);
