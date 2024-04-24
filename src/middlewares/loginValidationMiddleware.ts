import { NextFunction, Request, Response } from "express";
import {
  FieldValidationError,
  body,
  validationResult,
} from "express-validator";

export const loginValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allBodyValidation: any[] = [];

  allBodyValidation.push(
    body("loginOrEmail")
      .trim()
      .isString()
      .withMessage("Field must be a string")
      .notEmpty()
      .withMessage("Field is required")
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
    //console.log(errors.array());
    //console.log(errors.array().map((error) => error));

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
