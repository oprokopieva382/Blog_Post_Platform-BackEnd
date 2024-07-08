import { injectable } from "inversify";
import { MeViewModel, UserViewModel } from "../type-models";

@injectable()
class AuthDTO {
  transform(me: UserViewModel): MeViewModel {
    return {
      email: me.email,
      login: me.login,
      userId: me.id,
    };
  }
}

export { AuthDTO };
