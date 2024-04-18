import { NextFunction, Request, Response } from "express";
import { FieldValidationError, body, validationResult } from "express-validator";

export const blogPostValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allBodyValidation: any[] = [];

    allBodyValidation.push(
      body("title")
        .trim()
        .isString()
        .withMessage("Title field must be a string")
        .notEmpty()
        .withMessage("Title field is required")
        .isLength({ max: 30 })
        .withMessage("max length of title 30 characters")
    );

    allBodyValidation.push(
      body("shortDescription")
        .trim()
        .isString()
        .withMessage("Description field must be a string")
        .notEmpty()
        .withMessage("Description field is required")
        .isLength({ max: 100 })
        .withMessage("max length of description 100 characters")
    );

    allBodyValidation.push(
      body("content")
        .trim()
        .isString()
        .withMessage("Content field must be a string")
        .notEmpty()
        .withMessage("Content field is required")
        .isLength({ max: 1000 })
        .withMessage("max length of content 1000 characters")
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
