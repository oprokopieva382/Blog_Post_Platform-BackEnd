import { bcryptService } from ".";
import { LoginInputModel } from "../models";
import { usersRepository } from "../repositories";

export const authService = {
  async loginUser(data: LoginInputModel) {
    // const findUser = await usersRepository.getByLoginOrEmail(data.loginOrEmail);

    // if (!findUser) {
    //   return null;
    // }
    // const user = await usersRepository.getByIdUser(findUser._id.toString());

    // const isPasswordCorrect = await bcryptService.testPassword(
    //   user.password,
    //   data.password
    // );
  },
};
