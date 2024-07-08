import "reflect-metadata";
import { Response, Request, NextFunction } from "express";
import { ApiError } from "../helper/api-errors";
import { AuthRepository } from "../repositories";
import { container } from "../composition-root";

const authRepository = container.get<AuthRepository>(AuthRepository);

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
