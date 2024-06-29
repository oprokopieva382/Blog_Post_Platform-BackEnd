import jwt, { JwtPayload } from "jsonwebtoken";
import { SETTINGS } from "../settings";
import { ApiError } from "../helper/api-errors";

export class JwtService {
  async createAccessToken(userId: string) {
    const aToken = jwt.sign({ userId }, SETTINGS.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: "10m",
    });

    return {
      accessToken: aToken,
    };
  }

  async createRefreshToken(userId: string, deviceId: string) {
    return jwt.sign({ userId, deviceId }, SETTINGS.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: "20m",
    });
  }

  async getUserIdByAccessToken(token: string) {
    try {
      const result = jwt.verify(
        token,
        SETTINGS.JWT_ACCESS_TOKEN_SECRET
      ) as JwtPayload;
      return result.userId;
    } catch (error) {
      throw ApiError.UnauthorizedError("Unauthorized. Invalid access token");
    }
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      const result = jwt.verify(
        refreshToken,
        SETTINGS.JWT_REFRESH_TOKEN_SECRET
      ) as JwtPayload;
      return result;
    } catch (error) {
      throw ApiError.UnauthorizedError("Unauthorized", [
        "Unauthorized. No access to the session.",
      ]);
    }
  }
}
