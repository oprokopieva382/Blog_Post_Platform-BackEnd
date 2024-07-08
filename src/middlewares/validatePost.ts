import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import {
  FieldValidationError,
  body,
  validationResult,
} from "express-validator";
import { ApiError } from "../helper/api-errors";
import { BlogRepository } from "../repositories";
import { container } from "../composition-root";

const blogRepository = container.get<BlogRepository>(BlogRepository);

const validateBlogId = async (blogId: string) => {
  const blog = await blogRepository.getByIdBlog(blogId);
  if (!blog) {
    throw ApiError.BadRequestError("Validation failed", [
      {
        message: "No blog exists with the provided ID",
        field: "blogId",
      },
    ]);
  }
  return true;
};

export const validatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

    allBodyValidation.push(
      body("blogId")
        .trim()
        .notEmpty()
        .withMessage("blogId field is required")
        .custom(async (blogId) => {
          await validateBlogId(blogId);
        })
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
