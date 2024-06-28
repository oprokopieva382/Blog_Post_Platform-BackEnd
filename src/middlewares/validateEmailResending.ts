import { Response, Request, NextFunction } from "express";
import { AuthRepository } from "../repositories";
import { ApiError } from "../helper/api-errors";

const authRepository = new AuthRepository();

export const validateEmailResending = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authRepository.getByLoginOrEmail(req.body.email);

    if (!result) {
      throw ApiError.BadRequestError("Bad Request", [
        {
          message: "Email is not found",
          field: "email",
        },
      ]);
    }

    if (result.emailConfirmation.isConfirmed === true) {
      throw ApiError.BadRequestError("Bad Request", [
        {
          message: "Email is already confirmed",
          field: "email",
        },
      ]);
    }

    next();
  } catch (error) {
    next(error);
  }
};
