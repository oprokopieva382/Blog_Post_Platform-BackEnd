import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../helper/api-errors";
import { JwtService } from "../services";
import { UserQueryRepository } from "../query_repositories";
import { container } from "../composition-root";

const jwtService = container.get<JwtService>(JwtService);
const userQueryRepository =
  container.get<UserQueryRepository>(UserQueryRepository);

export const isAuthorizedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      throw ApiError.UnauthorizedError("Not authorized", [
        "Authorization failed. No token provided",
      ]);
    }

    const token = req.headers.authorization.split(" ")[1];

    const userId = await jwtService.getUserIdByAccessToken(token);

    if (!userId) {
      throw ApiError.UnauthorizedError("Not authorized", [
        "Authorization failed. Access token is incorrect or expired",
      ]);
    }

    //getting authorizedUser from cache or DB
    const authorizedUser = await userQueryRepository.getByIdUser(userId);
    if (!authorizedUser) {
      throw ApiError.UnauthorizedError("Not authorized", [
        "Authorization failed. Can't find user with such id",
      ]);
    }

    req.user = authorizedUser;
    next();
  } catch (error) {
    next(error);
  }
};
