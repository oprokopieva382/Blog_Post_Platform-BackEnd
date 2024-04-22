import { Router } from "express";
import { usersController } from "./usersController";

export const usersRouter = Router();

usersRouter.get("/", usersController.getAll);
usersRouter.post("/", usersController.create);
usersRouter.delete("/:id", usersController.deleteById);
