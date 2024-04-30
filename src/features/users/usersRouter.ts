import { Router } from "express";
import { usersController } from "./usersController";
import { authAdminMiddleware, userValidationMiddleware } from "../../middlewares";

export const usersRouter = Router();

usersRouter.get("/", authAdminMiddleware, usersController.getAll);
usersRouter.post(
  "/",
  authAdminMiddleware,
  userValidationMiddleware,
  usersController.create
);
usersRouter.delete("/:id", authAdminMiddleware, usersController.deleteById);
