import { NextFunction, Request, Response } from "express";
import { jwtTokenService } from "../features/application";
import { usersQueryRepository } from "../query_repositories";
import { ApiError } from "../helper/api-errors";

export const isAuthorizedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      throw ApiError.UnauthorizedError("Not authorized", ["Unauthorized"]);
    }

    const token = req.headers.authorization.split(" ")[1];

    const userId = await jwtTokenService.getUserIdByAccessToken(token);

    if (!userId) {
      throw ApiError.UnauthorizedError("Not authorized", [
        "Authorization failed. Access token is incorrect or expired",
      ]);
    }

    const foundUser = await usersQueryRepository.getByIdUser(userId);
    if (!foundUser) {
      throw ApiError.UnauthorizedError("Not authorized", [
        "Authorization failed. Can't find user with such id",
      ]);
    }

    req.user = foundUser;
    next();
  } catch (error) {
    next(error);
  }
};
