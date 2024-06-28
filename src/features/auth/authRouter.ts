import { Router } from "express";
import { AuthController} from "./AuthController";
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
  validateNewPasswordInputs,
} from "../../middlewares";

export const authRouter = Router();
const authController = new AuthController();

authRouter.get(
  "/me",
  isAuthorizedMiddleware,
  authController.me.bind(authController)
);
authRouter.post(
  "/login",
  rateLimitMiddleware,
  validateLoginInputs,
  authController.login.bind(authController)
);
authRouter.post(
  "/registration",
  rateLimitMiddleware,
  validateRegistrationInput,
  validateUserLoginUnique,
  validateUserEmailUnique,
  authController.registration.bind(authController)
);
authRouter.post(
  "/registration-confirmation",
  rateLimitMiddleware,
  validateRegistrationCode,
  validateEmailConfirmation,
  authController.registrationConfirmation.bind(authController)
);
authRouter.post(
  "/registration-email-resending",
  rateLimitMiddleware,
  validateEmail,
  validateEmailResending,
  authController.registrationResending.bind(authController)
);
authRouter.post(
  "/logout",
  isAuthorizedRefreshToken,
  authController.logout.bind(authController)
);

authRouter.post(
  "/refresh-token",
  isAuthorizedRefreshToken,
  authController.refreshToken.bind(authController)
);
authRouter.post(
  "/password-recovery",
  rateLimitMiddleware,
  validateEmail,
  authController.passwordRecovery.bind(authController)
);
authRouter.post(
  "/new-password",
  rateLimitMiddleware,
  validateNewPasswordInputs,
  authController.setNewPassword.bind(authController)
);

