import { NextFunction, Request, Response } from "express";
import {
  FieldValidationError,
  body,
  validationResult,
} from "express-validator";
import { ApiError } from "../helper/api-errors";

export const validateRegistrationInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allBodyValidation: any[] = [];

    allBodyValidation.push(
      body("login")
        .trim()
        .isString()
        .withMessage("login field must be a string")
        .notEmpty()
        .withMessage("login field is required")
        .isLength({ max: 10 })
        .withMessage("max length of login 10 characters")
        .isLength({ min: 3 })
        .withMessage("min length of login 3 characters")
        .matches(/^[a-zA-Z0-9_-]*$/)
        .withMessage(
          "login must contain only alphanumeric characters, underscores, or dashes"
        )
    );

    allBodyValidation.push(
      body("email")
        .trim()
        .isString()
        .withMessage("Email field must be a string")
        .notEmpty()
        .withMessage("Email field is required")
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .withMessage("email must be a valid email address")
    );

    allBodyValidation.push(
      body("password")
        .trim()
        .isString()
        .withMessage("Password field must be a string")
        .notEmpty()
        .withMessage("Password field is required")
        .isLength({ max: 20 })
        .withMessage("max length of password 20 characters")
        .isLength({ min: 6 })
        .withMessage("min length of password 6 characters")
    );

    await Promise.all(allBodyValidation.map((item) => item.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsMessages = errors.array({
        onlyFirstError: true,
      }) as FieldValidationError[];
      throw ApiError.BadRequestError(
        "Validation failed",
        errorsMessages.map((error) => ({
          message: error.msg,
          field: error.path,
        }))
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
