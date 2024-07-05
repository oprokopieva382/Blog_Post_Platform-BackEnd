import { NextFunction, Request, Response } from "express";
import { jwtService, userQueryRepository } from "../composition-root";

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

    req.user = authorizedUser;
    next();
  } catch (error) {
    next(error);
  }
};
