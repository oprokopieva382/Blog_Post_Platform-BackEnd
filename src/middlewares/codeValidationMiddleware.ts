import { NextFunction, Request, Response } from "express";
import {
  FieldValidationError,
  body,
  validationResult,
} from "express-validator";

export const codeValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
