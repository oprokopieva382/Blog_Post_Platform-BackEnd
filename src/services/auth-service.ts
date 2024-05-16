import { randomUUID } from "crypto";
import { bcryptService } from ".";
import {
  LoginInputModel,
  RegistrationConfirmationCodeModel,
  UserInputModel,
} from "../models";
import { authRepository, usersRepository } from "../repositories";
import { add } from "date-fns/add";
import { ObjectId } from "mongodb";
import { emailAdapter } from "../features/adapters";
import { RegistrationEmailResending } from "../types/RegistrationEmailResending";

export const authService = {
  async loginUser(data: LoginInputModel) {
    const findUser = await authRepository.getByLoginOrEmail(data.loginOrEmail);
    console.log(findUser);

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

  async logoutUser(refreshToken: string) {

  },

  async registerUser(data: UserInputModel) {
    const { login, password, email } = data;
    const findUser = await authRepository.getByLoginOrEmail(login);

    if (findUser) return false;

    const passwordHash = await bcryptService.createHash(password);

    const newUser = {
      _id: new ObjectId(),
      login,
      email,
      password: passwordHash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: false,
      },
    };

    await usersRepository.createUser(newUser);

    await emailAdapter.sendEmail(
      newUser.email,
      newUser.emailConfirmation.confirmationCode
    );

    return newUser;
  },

  async confirmUser(data: RegistrationConfirmationCodeModel) {
    const findUser = await authRepository.getByConfirmationCode(data.code);

    if (!findUser) return;
    return await authRepository.updateConfirmation(findUser._id);
  },

  async confirmResentUser(data: RegistrationEmailResending) {
    const findUser = await authRepository.getByLoginOrEmail(data.email);

    if (!findUser) return false;

    const newCode = randomUUID();
    const updatedUser = await authRepository.updateCode(findUser._id, newCode)

    emailAdapter.sendEmail(
      data.email,
      newCode
    );

    return findUser;
  },
};
