import { bcryptService } from ".";
import { LoginInputModel } from "../models";
import { authRepository } from "../repositories";

export const authService = {
  async loginUser(data: LoginInputModel) {
    const findUser = await authRepository.getByLoginOrEmail(data.loginOrEmail);
    
    if (!findUser) {
      return null;
    }

    const isPasswordCorrect = await bcryptService.testPassword(
      data.password,
      findUser.password
      );
     
      if (!isPasswordCorrect) {
        return 401
      } 

      return findUser;
  },
};
