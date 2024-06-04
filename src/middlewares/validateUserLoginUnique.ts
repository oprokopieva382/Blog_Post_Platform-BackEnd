import { Response, Request, NextFunction } from "express";
import { authRepository } from "../repositories";
import { ApiError } from "../helper/api-errors";

export const validateUserLoginUnique = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authRepository.getByLoginOrEmail(req.body.login);
    if (!result) {
      next();
      return;
    }

    throw ApiError.BadRequestError("User already exists", [
      {
        message: "User already exists",
        field: "login",
      },
    ]);
  } catch (error) {
    next(error);
  }
};
