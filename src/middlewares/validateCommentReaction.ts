import { NextFunction, Request, Response } from "express";
import {
  FieldValidationError,
  body,
  validationResult,
} from "express-validator";
import { ApiError } from "../helper/api-errors";
import { LikeStatus } from "../types/LikesStatus";
import { log } from "console";

// export const isValidLikeStatus = (value: any): boolean => {
//   return Object.values(LikeStatus).includes(value);
// };

// console.log("isValidLikeStatus", isValidLikeStatus);
const validLikeStatusRegex = /^(Like|None|Dislike)$/;
export const validateCommentReaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allBodyValidation: any[] = [];

    allBodyValidation.push(
      body("likeStatus")
        .trim()
        .isString()
        .withMessage("likeStatus field must be a string")

        .matches(validLikeStatusRegex)
        .withMessage("regex validation failure")
      // .custom((value) => {
      //   if (!isValidLikeStatus(value)) {
      //     throw new Error("Invalid likeStatus value.");
      //   }
      //   return true;
      // })
    );
    console.log(111);
    await Promise.all(allBodyValidation.map((item) => item.run(req)));

    const errors = validationResult(req);
    console.log(errors);
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
