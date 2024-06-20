import { ObjectId } from "mongodb";
import { UserDBType } from "../cloud_DB";
import { sessionsCollection, usersCollection } from "../cloud_DB/mongo_db_atlas";
import { SessionsDBType } from "../cloud_DB/mongo_db_types";

export const authRepository = {
  async getByLoginOrEmail(data: string): Promise<UserDBType | null> {
    return await usersCollection.findOne({
      $or: [{ email: data }, { login: data }],
    });
  },

  async getByConfirmationCode(code: string): Promise<UserDBType | null> {
    return await usersCollection.findOne({
      "emailConfirmation.confirmationCode": code,
    });
  },

  async updateCode(userId: ObjectId, newCode: string): Promise<Boolean> {
    const updatedUser = await usersCollection.updateOne(
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
    return await usersCollection.findOneAndUpdate(
      { _id },
      { $set: { "emailConfirmation.isConfirmed": true } },
      { returnDocument: "after" }
    );
  },

  async createSession(newSession: SessionsDBType) {
    return await sessionsCollection.insertOne(newSession);
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
    return await sessionsCollection.findOneAndUpdate(
      { deviceId },
      { $set: { iat, exp } },
      { returnDocument: "after" }
    );
  },

  async getSessionByDeviceId(deviceId: string) {
    return await sessionsCollection.findOne({ deviceId });
  },

  async removeSession(deviceId: string) {
    return await sessionsCollection.findOneAndDelete({
      deviceId,
    });
  },
};
