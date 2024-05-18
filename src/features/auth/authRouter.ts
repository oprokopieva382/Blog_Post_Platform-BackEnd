import { Router } from "express";
import { authController } from "./authController";
import {
  authMiddleware,
  emailCodeValidation,
  emailValidation,
  loginInputValidation,
  userRegistrationInputValidation,
  emailConfirmationValidation,
  emailResendingValidation,
  validationUserEmailUnique,
  validationUserLoginUnique,
  tokensValidation,
} from "../../middlewares";

export const authRouter = Router();

authRouter.post("/login", loginInputValidation, authController.login);
authRouter.get("/me", authMiddleware, authController.me);
authRouter.post(
  "/registration",
  userRegistrationInputValidation,
  validationUserLoginUnique,
  validationUserEmailUnique,
  authController.registration
);
authRouter.post(
  "/registration-confirmation",
  emailCodeValidation,
  emailConfirmationValidation,
  authController.registrationConfirmation
);
authRouter.post(
  "/registration-email-resending",
  emailValidation,
  emailResendingValidation,
  authController.registrationResending
);
authRouter.post("/logout", tokensValidation, authController.logout);
authRouter.post(
  "/refresh-token",
  tokensValidation,
  authController.refreshToken
);
