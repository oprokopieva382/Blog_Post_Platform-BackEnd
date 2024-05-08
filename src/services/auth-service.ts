import { randomUUID } from "crypto";
import { bcryptService } from ".";
import { LoginInputModel, UserInputModel } from "../models";
import { authRepository, usersRepository } from "../repositories";
import { add } from "date-fns/add";
import { ObjectId } from "mongodb";

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
      return 401;
    }

    return findUser;
  },

  async registerUser(data: UserInputModel) {
    const {login, password, email }= data
    const findUser = await authRepository.getByLoginOrEmail(email);

    if (findUser) return null;
  
    const passwordHash = await bcryptService.createHash(password);

    const newUser = {
      _id: new ObjectId(),
      login,
      email,
      password: passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: false,
      },
    };

    await usersRepository.createUser(newUser)

    return findUser;
  },
};
