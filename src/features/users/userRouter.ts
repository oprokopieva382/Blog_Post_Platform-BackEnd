import { Router } from "express";
import { UserController } from "./UserController";
import {
  isAdminMiddleware,
  validateRegistrationInput,
} from "../../middlewares";

export const userRouter = Router();
const userController = new UserController();

userRouter.get(
  "/",
  isAdminMiddleware,
  userController.getAll.bind(userController)
);
userRouter.post(
  "/",
  isAdminMiddleware,
  validateRegistrationInput,
  userController.create.bind(userController)
);
userRouter.delete(
  "/:id",
  isAdminMiddleware,
  userController.deleteById.bind(userController)
);
