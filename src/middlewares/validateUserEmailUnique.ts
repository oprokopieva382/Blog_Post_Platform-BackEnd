import { Response, Request, NextFunction } from "express";
import { AuthRepository } from "../repositories";
import { ApiError } from "../helper/api-errors";

const authRepository = new AuthRepository();

export const validateUserEmailUnique = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authRepository.getByLoginOrEmail(req.body.email);
    if (!result) {
      return next();
    }

    throw ApiError.BadRequestError("User already exists", [
      {
        message: "User already exists",
        field: "email",
      },
    ]);
  } catch (error) {
    next(error);
  }
};
