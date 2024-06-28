import { MeViewModel, UserViewModel } from "../type-models";

class AuthDTO {
  static transform(me: UserViewModel): MeViewModel {
    return {
      email: me.email,
      login: me.login,
      userId: me.id,
    };
  }
}

export { AuthDTO };
