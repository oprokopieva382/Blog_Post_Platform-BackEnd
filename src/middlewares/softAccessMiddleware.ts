import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { UserQueryRepository } from "../query_repositories";
import { JwtService } from "../services";
import { container } from "../composition-root";

const jwtService = container.get<JwtService>(JwtService);
const userQueryRepository =
  container.get<UserQueryRepository>(UserQueryRepository);

export const softAccessMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      return next();
    }

    const token = req.headers.authorization.split(" ")[1];

    const userId = await jwtService.getUserIdByAccessToken(token);

    if (!userId) {
      return next();
    }

    //getting authorizedUser from cache or DB
    const authorizedUser = await userQueryRepository.getByIdUser(userId);
    if (!authorizedUser) {
      return next();
    }
    console.log(authorizedUser)

    req.user = authorizedUser;
    next();
  } catch (error) {
    next(error);
  }
};
