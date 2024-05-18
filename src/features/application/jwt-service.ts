import jwt, { JwtPayload } from "jsonwebtoken";
import { SETTINGS } from "../../settings";

export const jwtTokenService = {
  async createAccessToken(userId: string) {
    const aToken = jwt.sign({ userId }, SETTINGS.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: "10s",
    });

    return {
      accessToken: aToken,
    };
  },

  async createRefreshToken(userId: string) {
    const rToken = jwt.sign(
      { userId},
      SETTINGS.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );

    return {
      refreshToken: rToken,
    };
  },

  async getUserIdByAccessToken(token: string) {
    try {
      const result = jwt.verify(
        token,
        SETTINGS.JWT_ACCESS_TOKEN_SECRET
      ) as JwtPayload;
      return result.userId;
    } catch (error) {
      return null;
    }
  },

  async getUserIdByRefreshToken(token: string) {
    try {
      const result = jwt.verify(
        token,
        SETTINGS.JWT_REFRESH_TOKEN_SECRET
      ) as JwtPayload;
      return result.userId;
    } catch (error) {
      return null;
    }
  },

};
