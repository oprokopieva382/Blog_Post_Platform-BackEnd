import { Router } from "express";
import { usersController } from "./usersController";
import {
  authAdminMiddleware,
  validateRegistrationInput,
} from "../../middlewares";

export const usersRouter = Router();

usersRouter.get("/", authAdminMiddleware, usersController.getAll);
usersRouter.post(
  "/",
  authAdminMiddleware,
  validateRegistrationInput,
  usersController.create
);
usersRouter.delete("/:id", authAdminMiddleware, usersController.deleteById);
