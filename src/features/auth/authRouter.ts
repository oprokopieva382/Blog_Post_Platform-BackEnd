import { Router } from "express";
import { authController } from "./authController";
import {
  authMiddleware,
  codeValidationMiddleware,
  emailValidationMiddleware,
  loginValidationMiddleware,
  userValidationMiddleware,
  validationEmailConfirmation,
  validationEmailResending,
  validationUserEmailUnique,
  validationUserLoginUnique,
} from "../../middlewares";

export const authRouter = Router();

authRouter.post("/login", loginValidationMiddleware, authController.login);
authRouter.get("/me", authMiddleware, authController.me);
authRouter.post(
  "/registration",
  userValidationMiddleware,
  validationUserLoginUnique,
  validationUserEmailUnique,
  authController.registration
);
authRouter.post(
  "/registration-confirmation",
  codeValidationMiddleware,
  validationEmailConfirmation,
  authController.registrationConfirmation
);
authRouter.post(
  "/registration-email-resending",
  emailValidationMiddleware,
  validationEmailResending,
  authController.registrationResending
);
authRouter.post(
  "/logout",
  //emailValidationMiddleware,
  //validationEmailResending,
  authController.logout
);
