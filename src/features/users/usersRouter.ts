import { Router } from "express";
import { usersController } from "./usersController";
import { authMiddleware, userValidationMiddleware } from "../../middlewares";

export const usersRouter = Router();

usersRouter.get("/", authMiddleware, usersController.getAll);
usersRouter.post("/", authMiddleware, userValidationMiddleware, usersController.create);
usersRouter.delete("/:id", authMiddleware, usersController.deleteById);
