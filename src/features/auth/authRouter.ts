import { Router } from "express";
import { authController } from "./authController";
import { loginValidationMiddleware } from "../../middlewares";

export const authRouter = Router();

authRouter.post("/login", loginValidationMiddleware, authController.login);
