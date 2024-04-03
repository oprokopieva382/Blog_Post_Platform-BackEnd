import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const putValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allBodyValidation: any[] = [];

  if (req.body.name) {
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
  }

  if (req.body.description) {
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
  }

  if (req.body.websiteUrl) {
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
  }

 
  await Promise.all(allBodyValidation.map((item) => item.run(req)));

  const errors = validationResult(req).array({ onlyFirstError: true });
  console.log(errors);
  if (errors.length) {
    return res.status(400).json({
      errorsMessages: [{ message: errors[0].msg, field: errors[0].type }],
    });
  }

  next();
  return;
};
