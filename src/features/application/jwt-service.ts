import { UserViewModel } from "../../models";
import jwt from "jsonwebtoken";
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
};
