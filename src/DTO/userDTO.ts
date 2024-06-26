import { UserDBType } from "../cloud_DB";
import { UserViewModel } from "../type-models";

export const userDTO = (user: UserDBType): UserViewModel => {
  return {
    // Convert ObjectId to string
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
};
