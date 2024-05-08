import { Router } from "express";
import { authController } from "./authController";
import { authMiddleware, codeValidationMiddleware, loginValidationMiddleware, userValidationMiddleware } from "../../middlewares";

export const authRouter = Router();

authRouter.post("/login", loginValidationMiddleware, authController.login);
authRouter.get("/me", authMiddleware, authController.me);
authRouter.post("/registration", userValidationMiddleware, authController.registration);
authRouter.post(
  "/registration-confirmation",
  codeValidationMiddleware, authController.registrationConfirmation
);
