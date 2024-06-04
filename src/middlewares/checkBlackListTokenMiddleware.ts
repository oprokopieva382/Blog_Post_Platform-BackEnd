import { Response, Request, NextFunction } from "express";
import { blackListTokenCollection } from "../cloud_DB";
import { ApiError } from "../helper/api-errors";

export const checkBlackListTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
   
    if (!refreshToken) {
      throw ApiError.UnauthorizedError("Not authorized", [
        "Missing refresh token",
      ]);
    }

    const isIncluded = await blackListTokenCollection.findOne({refreshToken});

    if (isIncluded) {
      throw ApiError.UnauthorizedError("Not authorized", [
        "JWT refreshToken already used",
      ]);
    }

    next();
  } catch (error) {
    next(error);
  }
};
