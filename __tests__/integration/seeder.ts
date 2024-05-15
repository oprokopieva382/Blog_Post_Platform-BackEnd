import { authRepository } from "../../src/repositories";

export const user = {
  login: "OksanaYo",
  password: "oksana1234",
  email: "oprokopieva382@gmail.com",
};

export const findUserInDB = async (email: string) => {
  const user = await authRepository.getByLoginOrEmail(email);

  return user;
};
