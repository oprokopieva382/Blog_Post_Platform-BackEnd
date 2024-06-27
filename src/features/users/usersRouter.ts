import { Router } from "express";
import { usersController } from "./UsersController";
import {
  isAdminMiddleware,
  validateRegistrationInput,
} from "../../middlewares";

export const usersRouter = Router();

usersRouter.get("/", isAdminMiddleware, usersController.getAll);
usersRouter.post(
  "/",
  isAdminMiddleware,
  validateRegistrationInput,
  usersController.create
);
usersRouter.delete("/:id", isAdminMiddleware, usersController.deleteById);
