import { NextFunction, Request, Response } from "express";
import {
  FieldValidationError,
  body,
  validationResult,
} from "express-validator";

export const commentValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allBodyValidation: any[] = [];

  allBodyValidation.push(
    body("content")
      .trim()
      .isString()
      .withMessage("Name field must be a string")
      .notEmpty()
      .withMessage("Name field is required")
      .isLength({ max: 300 })
      .withMessage("max length of name 300 characters")
      .isLength({ min: 20 })
      .withMessage("min length of name 20 characters")
  );

  await Promise.all(allBodyValidation.map((item) => item.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsFields = errors.array({
      onlyFirstError: true,
    }) as FieldValidationError[];
    return res.status(400).json({
      errorsMessages: errorsFields.map((error) => ({
        message: error.msg,
        field: error.path,
      })),
    });
  }

  next();
  return;
};
