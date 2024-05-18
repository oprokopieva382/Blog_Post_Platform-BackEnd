import { Router } from "express";
import { usersController } from "./usersController";
import {
  authAdminMiddleware,
  userRegistrationInputValidation,
} from "../../middlewares";

export const usersRouter = Router();

usersRouter.get("/", authAdminMiddleware, usersController.getAll);
usersRouter.post(
  "/",
  authAdminMiddleware,
  userRegistrationInputValidation,
  usersController.create
);
usersRouter.delete("/:id", authAdminMiddleware, usersController.deleteById);
