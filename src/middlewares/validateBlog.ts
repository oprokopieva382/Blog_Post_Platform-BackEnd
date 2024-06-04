import { NextFunction, Request, Response } from "express";
import {
  FieldValidationError,
  body,
  validationResult,
} from "express-validator";
import { ApiError } from "../helper/api-errors";

export const validateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allBodyValidation: any[] = [];

    allBodyValidation.push(
      body("name")
        .trim()
        .isString()
        .withMessage("Name field must be a string")
        .notEmpty()
        .withMessage("Name field is required")
        .isLength({ max: 15 })
        .withMessage("max length of name 15 characters")
    );

    allBodyValidation.push(
      body("description")
        .trim()
        .isString()
        .withMessage("Description field must be a string")
        .notEmpty()
        .withMessage("Description field is required")
        .isLength({ max: 100 })
        .withMessage("max length of description 500 characters")
    );

    allBodyValidation.push(
      body("websiteUrl")
        .trim()
        .isString()
        .withMessage("Website url field must be a string")
        .notEmpty()
        .withMessage("Website url field is required")
        .isLength({ max: 100 })
        .withMessage("max length of content 100 characters")
        .isURL({
          protocols: ["https"],
          require_protocol: true,
          require_host: true,
          allow_underscores: true,
          require_valid_protocol: true,
          validate_length: true,
          allow_fragments: false,
          allow_query_components: false,
        })
        .withMessage("Invalid URL format")
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
