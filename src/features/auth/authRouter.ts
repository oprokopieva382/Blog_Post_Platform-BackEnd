import { Router } from "express";
import { authController } from "./authController";
import {
  isAuthorizedMiddleware,
  validateRegistrationCode,
  validateEmail,
  validateLoginInputs,
  validateRegistrationInput,
  validateEmailConfirmation,
  validateEmailResending,
  validateUserEmailUnique,
  validateUserLoginUnique,
  validateRefreshToken,
  checkBlackListTokenMiddleware,
} from "../../middlewares";

export const authRouter = Router();

authRouter.post("/login", validateLoginInputs, authController.login);
authRouter.get("/me", isAuthorizedMiddleware, authController.me);
authRouter.post(
  "/registration",
  validateRegistrationInput,
  validateUserLoginUnique,
  validateUserEmailUnique,
  authController.registration
);
authRouter.post(
  "/registration-confirmation",
  validateRegistrationCode,
  validateEmailConfirmation,
  authController.registrationConfirmation
);
authRouter.post(
  "/registration-email-resending",
  validateEmail,
  validateEmailResending,
  authController.registrationResending
);
authRouter.post(
  "/logout",
  validateRefreshToken,
  checkBlackListTokenMiddleware,
  authController.logout
);
authRouter.post(
  "/refresh-token",
  validateRefreshToken,
  checkBlackListTokenMiddleware,
  authController.refreshToken
);
