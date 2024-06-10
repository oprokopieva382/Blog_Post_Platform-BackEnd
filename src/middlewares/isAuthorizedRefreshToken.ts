import { Response, Request, NextFunction } from "express";
import { jwtTokenService } from "../features/application";
import { ApiError } from "../helper/api-errors";
import { authRepository } from "../repositories";
import { fromUnixTime } from "date-fns/fromUnixTime";

export const isAuthorizedRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const token = await jwtTokenService.decodeToken(refreshToken);
    //console.log(refreshToken);

    if (!refreshToken) {
      throw ApiError.UnauthorizedError("Not authorized", ["Unauthorized"]);
    }

    const isValid = await jwtTokenService.validateRefreshToken(refreshToken);

    if (!isValid) {
      throw ApiError.UnauthorizedError("Not authorized", ["Unauthorized"]);
    }

    const currentSession = await authRepository.getSessionByDeviceId(
      token.deviceId
    );

    // console.log(currentSession);
    // console.log(token);

    if (currentSession?.iat !== fromUnixTime(token.iat!).toISOString()) {
      throw ApiError.UnauthorizedError("Not authorized", ["Unauthorized"]);
    }

    if (typeof refreshToken !== "string") {
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
