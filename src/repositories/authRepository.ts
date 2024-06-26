import { ObjectId } from "mongodb";
import {
  UserDBType,
  PasswordRecoveryDBType,
  SessionsDBType,
} from "../cloud_DB";
import { PasswordModel, SessionModel, UserModel } from "../models";

export const authRepository = {
  async getByLoginOrEmail(data: string): Promise<UserDBType | null> {
    return await UserModel.findOne({
      $or: [{ email: data }, { login: data }],
    });
  },

  async getByConfirmationCode(code: string): Promise<UserDBType | null> {
    return await UserModel.findOne({
      "emailConfirmation.confirmationCode": code,
    });
  },

  async updateCode(userId: ObjectId, newCode: string): Promise<Boolean> {
    const updatedUser = await UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          "emailConfirmation.confirmationCode": newCode,
        },
      }
    );
    return !!updatedUser.modifiedCount;
  },

  async updateConfirmation(_id: ObjectId): Promise<UserDBType | null> {
    return await UserModel.findOneAndUpdate(
      { _id },
      { $set: { "emailConfirmation.isConfirmed": true } },
      { new: true }
    );
  },

  async createSession(newSession: SessionsDBType) {
    return await SessionModel.create(newSession);
  },

  async updateSession({
    iat,
    exp,
    deviceId,
  }: {
    iat: string;
    exp: string;
    deviceId: string;
  }) {
    return await SessionModel.findOneAndUpdate(
      { deviceId },
      { $set: { iat, exp } },
      { new: true }
    );
  },

  async getSessionByDeviceId(deviceId: string) {
    return await SessionModel.findOne({ deviceId });
  },

  async removeSession(deviceId: string) {
    return await SessionModel.findOneAndDelete({
      deviceId,
    });
  },

  async savePasswordRecoveryInfo(passwordRecovery: PasswordRecoveryDBType) {
    return await PasswordModel.create({
      ...passwordRecovery,
    });
  },

  async getByRecoveryCode(
    recoveryCode: string
  ): Promise<PasswordRecoveryDBType | null> {
    return await PasswordModel.findOne({ recoveryCode });
  },

  async setNewPassword(email: string, newPassword: string) {
    return await UserModel.findOneAndUpdate(
      { email },
      { $set: { password: newPassword } },
      { new: true }
    );
  },
};
