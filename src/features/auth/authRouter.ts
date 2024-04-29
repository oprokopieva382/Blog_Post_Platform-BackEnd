import { Router } from "express";
import { authController } from "./authController";
import { authMiddleware, loginValidationMiddleware } from "../../middlewares";

export const authRouter = Router();

authRouter.post("/login", loginValidationMiddleware, authController.login);
authRouter.get("/me", authMiddleware, authController.me);
