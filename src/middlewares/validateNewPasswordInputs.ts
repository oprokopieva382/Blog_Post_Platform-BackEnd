import { NextFunction, Request, Response } from "express";
import {
  FieldValidationError,
  body,
  validationResult,
} from "express-validator";
import { ApiError } from "../helper/api-errors";

export const validateNewPasswordInputs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allBodyValidation: any[] = [];

    allBodyValidation.push(
      body("recoveryCode")
        .trim()
        .isString()
        .withMessage("Field must be a string")
        .notEmpty()
        .withMessage("Field is required")
    );

    allBodyValidation.push(
      body("newPassword")
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
