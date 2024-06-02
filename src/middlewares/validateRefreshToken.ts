import { Response, Request, NextFunction } from "express";
import { jwtTokenService } from "../features/application";
import { ApiError } from "../helper/api-errors";

export const validateRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      throw ApiError.UnauthorizedError("Not authorized", ["Unauthorized"]);
    }

    const isValid = await jwtTokenService.validateRefreshToken(
      token.refreshToken
    );

    if (!isValid) {
      throw ApiError.UnauthorizedError("Not authorized", ["Unauthorized"]);
    }

    if (typeof token.refreshToken !== "string") {
      throw ApiError.BadRequestError("Not authorized", [
        "Authorization failed. Refresh token must be a string",
      ]);
    }

    req.userId = isValid;
    next();
  } catch (error) {
    next(error);
  }
};
