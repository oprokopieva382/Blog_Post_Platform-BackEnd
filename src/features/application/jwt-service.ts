import { UserViewModel } from "../../models";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SETTINGS } from "../../settings";

export const jwtService = {
  async createJWT(user: UserViewModel) {
    const token = jwt.sign({ userId: user.id }, SETTINGS.JWT_SECRET, {
      expiresIn: "1h",
    });
    return {
      accessToken: token,
    };
  },

  async getUserIdByToken(token: string) {
    try {
      const result = jwt.verify(token, SETTINGS.JWT_SECRET) as JwtPayload; 
      return result.userId;
    } catch (error) {
      return null;
    }
  },
};
