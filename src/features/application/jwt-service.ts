import { UserViewModel } from "../../models";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SETTINGS } from "../../settings";

export const jwtTokenService = {
  async createAccessToken(user: UserViewModel) {
    const aToken = jwt.sign(
      { userId: user.id },
      SETTINGS.JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return {
      accessToken: aToken,
    };
  },

  async createRefreshToken(user: UserViewModel) {
    const rToken = jwt.sign(
      { userId: user.id },
      SETTINGS.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return {
      refreshToken: rToken,
    };
  },

  async getUserIdByToken(token: string) {
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
};
