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
import { jwtTokenService } from "../features/application";
import { blackListTokenCollection } from "../cloud_DB";
import { ApiError } from "../helper/api-errors";
import { SessionData } from "../types/SessionData";

export const authService = {
  async loginUser(data: LoginInputModel) {
    const findUser = await authRepository.getByLoginOrEmail(data.loginOrEmail);

    if (!findUser) {
      throw ApiError.BadRequestError("Bad request", [
        "Login failed. Can't find user, check your inputs or  register first",
      ]);
    }

    const isPasswordCorrect = await bcryptService.testPassword(
      data.password,
      findUser.password
    );

    if (!isPasswordCorrect) {
      throw ApiError.UnauthorizedError("Not authorized", [
        "Login failed. Password is incorrect.",
      ]);
    }

    return findUser;
  },

  async logoutUser(refreshToken: string) {
    return await this.addTokenToBlackList(refreshToken);
  },

  async registerUser(data: UserInputModel) {
    const { login, password, email } = data;
    const findUser = await authRepository.getByLoginOrEmail(login);

    if (findUser) {
      throw ApiError.BadRequestError("Bad Request", [
        "Registration failed. User already exists.",
      ]);
    }

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

    if (!findUser) {
      throw ApiError.BadRequestError("Bad Request", [
        "Can't find user by confirmation code",
      ]);
    }
    return await authRepository.updateConfirmation(findUser._id);
  },

  async confirmResentUser(data: RegistrationEmailResending) {
    const findUser = await authRepository.getByLoginOrEmail(data.email);

    if (!findUser) {
      throw ApiError.BadRequestError("Bad Request", [
        "Request failed. Can't find user with such email.",
      ]);
    }

    const newCode = randomUUID();
    await authRepository.updateCode(findUser._id, newCode);

    emailAdapter.sendEmail(data.email, newCode);

    return findUser;
  },

  async addTokenToBlackList(refreshToken: string) {
    return await blackListTokenCollection.insertOne({ refreshToken });
  },

  async refreshToken(refreshToken: string, userId: string, deviceId: string) {
    await this.addTokenToBlackList(refreshToken);
    const newAccessToken = await jwtTokenService.createAccessToken(userId);
    const newRefreshToken = await jwtTokenService.createRefreshToken(
      userId,
      deviceId
    );
    return { newAccessToken, newRefreshToken };
  },

  async createSession(sessionData: SessionData) {
    const newSession = {
      user_id: sessionData.userId,
      device_id: sessionData.deviceId,
      iat: new Date(sessionData.iat * 1000).toISOString(),
      device_name: sessionData.deviceName,
      ip: sessionData.IP,
      exp: new Date(sessionData.exp * 1000).toISOString(),
    };
    await authRepository.createSession(newSession);
  },
};
