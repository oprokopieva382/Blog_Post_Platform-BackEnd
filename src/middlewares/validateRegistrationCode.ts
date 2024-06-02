import { NextFunction, Request, Response } from "express";
import {
  FieldValidationError,
  body,
  validationResult,
} from "express-validator";
import { ApiError } from "../helper/api-errors";

export const validateRegistrationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allValidation: any[] = [];

    allValidation.push(
      body("code")
        .trim()
        .isString()
        .withMessage("Code field must be a string")
        .notEmpty()
        .withMessage("Code field is required")
    );

    await Promise.all(allValidation.map((item) => item.run(req)));

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
