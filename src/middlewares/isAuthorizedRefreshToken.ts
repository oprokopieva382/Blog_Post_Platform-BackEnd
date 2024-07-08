import { Response, Request, NextFunction } from "express";
import { ApiError } from "../helper/api-errors";
import { fromUnixTime } from "date-fns/fromUnixTime";
import { JwtService } from "../services";
import { AuthRepository } from "../repositories";
import { container } from "../composition-root";

const jwtService = container.get<JwtService>(JwtService);
const authRepository = container.get<AuthRepository>(AuthRepository);

export const isAuthorizedRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw ApiError.UnauthorizedError("Not authorized", ["Unauthorized"]);
    }

    const token = await jwtService.validateRefreshToken(refreshToken);

    if (!token.userId) {
      throw ApiError.UnauthorizedError("Not authorized", ["Unauthorized user"]);
    }

    const currentSession = await authRepository.getSessionByDeviceId(
      token.deviceId
    );

    if (currentSession?.iat !== fromUnixTime(token.iat!).toISOString()) {
      throw ApiError.UnauthorizedError("Not authorized", [
        "Unauthorized token",
      ]);
    }

    if (!currentSession) {
      throw ApiError.UnauthorizedError("Unauthorized. Session not found", [
        "The session for the given device ID does not exist.",
      ]);
    }

    if (typeof refreshToken !== "string") {
      throw ApiError.BadRequestError("Not authorized", [
        "Authorization failed. Refresh token must be a string",
      ]);
    }

    req.userId = token.userId;
    req.deviceId = token.deviceId;
    next();
  } catch (error) {
    next(error);
  }
};
