import { UserViewModel } from "../models";

export const jwtService = {
  async createJWT(user: UserViewModel) {
    return user;
  },
};
