import { Router } from "express";
import { userController } from "./UserController";
import {
  isAdminMiddleware,
  validateRegistrationInput,
} from "../../middlewares";

export const userRouter = Router();

userRouter.get("/", isAdminMiddleware, userController.getAll);
userRouter.post(
  "/",
  isAdminMiddleware,
  validateRegistrationInput,
  userController.create
);
userRouter.delete("/:id", isAdminMiddleware, userController.deleteById);
