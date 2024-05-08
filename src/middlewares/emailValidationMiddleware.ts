import { NextFunction, Request, Response } from "express";
import {
  FieldValidationError,
  body,
  validationResult,
} from "express-validator";

export const emailValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
 const allValidation: any[] = [];

 allValidation.push(
   body("email")
     .trim()
     .isString()
     .withMessage("Email field must be a string")
     .notEmpty()
     .withMessage("Email field is required")
     .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
     .withMessage("email must be a valid email address")
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
