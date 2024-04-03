import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { postsRepository } from "../repositories/posts-repository";

const validateBlogId = async (blogId: string) => {
  const blog = await postsRepository.getByIdPost(+blogId);
  if (!blog) {
    throw new Error("No blog exists with the provided ID");
  }
};

export const postValidationMiddleware = [
  body("title")
    .trim()
    .isString()
    .withMessage("Title field must be a string")
    .notEmpty()
    .withMessage("Title field is required")
    .isLength({ max: 30 })
    .withMessage("max length of title 30 characters"),

  body("shortDescription")
    .trim()
    .isString()
    .withMessage("Description field must be a string")
    .notEmpty()
    .withMessage("Description field is required")
    .isLength({ max: 100 })
    .withMessage("max length of description 100 characters"),

  body("content")
    .trim()
    .isString()
    .withMessage("Content field must be a string")
    .notEmpty()
    .withMessage("Content field is required")
    .isLength({ max: 1000 })
    .withMessage("max length of content 100 characters"),

  body("blogId")
    .exists({ checkFalsy: true })
    .withMessage("blogId field is required")
    .custom(async (blogId) => {
      await validateBlogId(blogId);
    }),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    console.log(errors);
    if (errors.length) {
      return res.status(400).json({
        errorsMessages: [{ message: errors[0].msg, field: errors[0].type }],
      });
    }
    next();
    return;
  },
];
