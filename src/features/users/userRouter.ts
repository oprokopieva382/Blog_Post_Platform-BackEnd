import { Router } from "express";
import {
  isAdminMiddleware,
  validateRegistrationInput,
} from "../../middlewares";
import { container } from "../../composition-root";
import { UserController } from "./UserController";

const userController = container.resolve(UserController);
export const userRouter = Router();

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
