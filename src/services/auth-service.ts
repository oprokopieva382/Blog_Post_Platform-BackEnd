import { randomUUID } from "crypto";
import { Request } from "express";
import { bcryptService } from ".";
import {
  LoginInputModel,
  RegistrationConfirmationCodeModel,
  UserInputModel,
} from "../models";
import { authRepository, usersRepository } from "../repositories";
import { add } from "date-fns/add";
import { fromUnixTime } from "date-fns/fromUnixTime";
import { ObjectId } from "mongodb";
import { emailAdapter } from "../features/adapters";
import { RegistrationEmailResending } from "../types/RegistrationEmailResending";
import { jwtTokenService } from "../features/application";
import { blackListTokenCollection } from "../cloud_DB";
import { ApiError } from "../helper/api-errors";
import { userDTO } from "../utils/mapDBToView";
import { SessionData } from "../types/SessionData";

export const authService = {
  async loginUser(data: LoginInputModel, req: Request) {
    const userData = await authRepository.getByLoginOrEmail(data.loginOrEmail);

    if (!userData) {
       throw ApiError.UnauthorizedError("Not authorized", [
         "Login failed. Password is incorrect.",
       ]);
    }

    const isPasswordCorrect = await bcryptService.testPassword(
      data.password,
      userData.password
    );

    if (!isPasswordCorrect) {
      throw ApiError.UnauthorizedError("Not authorized", [
        "Login failed. Password is incorrect.",
      ]);
    }

    const deviceId = randomUUID();
    const IP = req.ip;
    const deviceName = req.headers["user-agent"] || "Unknown Device";
    const user = userDTO(userData);

    const accessToken = await jwtTokenService.createAccessToken(user.id);
    const refreshToken = await jwtTokenService.createRefreshToken(
      user.id,
      deviceId
    );

    const { iat, exp } = await jwtTokenService.decodeToken(refreshToken);

    await this.createSession({
      userId: user.id,
      deviceId,
      iat: iat!,
      deviceName,
      ip: IP!,
      exp: exp!,
    });

    return { accessToken, refreshToken };
  },

  async logoutUser(refreshToken: string) {
    //return await this.addTokenToBlackList(refreshToken);

    const token = await jwtTokenService.decodeToken(refreshToken);
    const isSessionExist = await authRepository.getSessionByDeviceId(
      token.deviceId
    );

    if (!isSessionExist) {
      throw ApiError.UnauthorizedError("Unauthorized. Session not found", [
        "The session for the given device ID does not exist.",
      ]);
    }

    await authRepository.removeSession(token.deviceId);
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
        expirationDate: add(new Date().toISOString(), {
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

  //await this.addTokenToBlackList(refreshToken);
  async refreshToken(refreshToken: string, userId: string) {
    const token = await jwtTokenService.decodeToken(refreshToken);

    const newAccessToken = await jwtTokenService.createAccessToken(userId);
    const newRefreshToken = await jwtTokenService.createRefreshToken(
      userId,
      token.deviceId
    );

    await this.updateSession(newRefreshToken);
    return { newAccessToken, newRefreshToken };
  },

  async createSession(sessionData: SessionData) {
    const newSession = {
      _id: new ObjectId(),
      userId: sessionData.userId,
      deviceId: sessionData.deviceId,
      iat: fromUnixTime(sessionData.iat!).toISOString(),
      deviceName: sessionData.deviceName,
      ip: sessionData.ip,
      exp: fromUnixTime(sessionData.exp!).toISOString(),
    };
    await authRepository.createSession(newSession);
  },

  async updateSession(refreshToken: string) {
    const token = await jwtTokenService.decodeToken(refreshToken);

    const session = await authRepository.getSessionByDeviceId(token.deviceId);

    if (!session) {
      throw ApiError.UnauthorizedError("Unauthorized. Session not found", [
        "The session for the given device ID does not exist.",
      ]);
    }

    const tokenIat = fromUnixTime(token.iat!);
    const dbIat = new Date(session.iat);

    if (tokenIat > dbIat) {
      const result = await authRepository.updateSession({
        iat: tokenIat.toISOString(),
        exp: fromUnixTime(token.exp!).toISOString(),
        deviceId: token.deviceId,
      });
     }
  },
};
