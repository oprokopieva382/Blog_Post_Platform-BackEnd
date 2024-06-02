import { Router } from "express";
import { authController } from "./authController";
import {
  isAuthorizedMiddleware,
  validateRegistrationCode,
  emailValidation,
  validateLoginInputs,
  validateRegistrationInput,
  validateEmailConfirmation,
  emailResendingValidation,
  validationUserEmailUnique,
  validationUserLoginUnique,
  tokensRefreshValidationMiddleware,
  blackListTokenCheckMiddleware,
} from "../../middlewares";

export const authRouter = Router();

authRouter.post("/login", validateLoginInputs, authController.login);
authRouter.get("/me", isAuthorizedMiddleware, authController.me);
authRouter.post(
  "/registration",
  validateRegistrationInput,
  validationUserLoginUnique,
  validationUserEmailUnique,
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
  emailValidation,
  emailResendingValidation,
  authController.registrationResending
);
authRouter.post(
  "/logout",
  tokensRefreshValidationMiddleware,
  blackListTokenCheckMiddleware,
  authController.logout
);
authRouter.post(
  "/refresh-token",
  tokensRefreshValidationMiddleware,
  blackListTokenCheckMiddleware,
  authController.refreshToken
);
