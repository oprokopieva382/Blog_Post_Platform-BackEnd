import { UserViewModel } from "../../models";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SETTINGS } from "../../settings";
import { blackListTokenCollection } from "../../cloud_DB";
import { BlackListTokenDBType } from "../../cloud_DB/mongo_db_types";

export const jwtTokenService = {
  async createAccessToken(user: UserViewModel) {
    const aToken = jwt.sign(
      { userId: user.id },
      SETTINGS.JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10s",
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
        expiresIn: "20s",
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

  async addTokenToBlackList(refreshToken: string) {
    const result = await blackListTokenCollection.insertOne({
      token: refreshToken,
    });
    return result;
  },
};
