import jwt, { JwtPayload } from "jsonwebtoken";
import { SETTINGS } from "../../settings";
import { ApiError } from "../../helper/api-errors";

export const jwtTokenService = {
  async createAccessToken(userId: string) {
    const aToken = jwt.sign({ userId }, SETTINGS.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    return {
      accessToken: aToken,
    };
  },

  async createRefreshToken(userId: string, deviceId: string) {
    const refreshToken = jwt.sign(
      { userId, deviceId },
      SETTINGS.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return refreshToken;
  },

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
  },

  async validateRefreshToken(refreshToken: string) {
    try {
      const result = jwt.verify(
        refreshToken,
        SETTINGS.JWT_REFRESH_TOKEN_SECRET
      ) as JwtPayload;
      return result.userId;
    } catch (error) {
      throw ApiError.UnauthorizedError("Unauthorized. Invalid refresh token");
    }
  },

  async decodeToken(token: string) {
    return jwt.decode(token) as JwtPayload;
  },
};
