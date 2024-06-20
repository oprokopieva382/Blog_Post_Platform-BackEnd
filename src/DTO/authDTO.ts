import { MeViewModel, UserViewModel } from "../models";

export const authDTO = (me: UserViewModel): MeViewModel => {
  return {
    email: me.email,
    login: me.login,
    userId: me.id,
  };
};
