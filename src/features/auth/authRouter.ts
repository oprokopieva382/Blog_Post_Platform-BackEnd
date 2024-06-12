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
  isAuthorizedRefreshToken,
  rateLimitMiddleware,
} from "../../middlewares";

export const authRouter = Router();

authRouter.post(
  "/login",
  rateLimitMiddleware,
  validateLoginInputs,
  authController.login
);
authRouter.get("/me", isAuthorizedMiddleware, authController.me);
authRouter.post(
  "/registration",
  rateLimitMiddleware,
  validateRegistrationInput,
  validateUserLoginUnique,
  validateUserEmailUnique,
  authController.registration
);
authRouter.post(
  "/registration-confirmation",
  rateLimitMiddleware,
  validateRegistrationCode,
  validateEmailConfirmation,
  authController.registrationConfirmation
);
authRouter.post(
  "/registration-email-resending",
  rateLimitMiddleware,
  validateEmail,
  validateEmailResending,
  authController.registrationResending
);
authRouter.post(
  "/logout",
  isAuthorizedRefreshToken,
  authController.logout
);
authRouter.post(
  "/refresh-token",
  isAuthorizedRefreshToken,
  authController.refreshToken
);
