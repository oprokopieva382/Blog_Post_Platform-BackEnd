import { UserDBType } from "../cloud_DB";
import { UserViewModel } from "../type-models";

class UserDTO {
  static transform(user: UserDBType): UserViewModel {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

export { UserDTO };