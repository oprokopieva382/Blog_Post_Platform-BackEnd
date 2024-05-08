import { ObjectId } from "mongodb";
import { UserDBType } from "../cloud_DB";
import { usersCollection } from "../cloud_DB/mongo_db_atlas";

export const authRepository = {
  async getByLoginOrEmail(
    login?: string,
    email?: string
  ): Promise<UserDBType | null> {
    const foundUser = await usersCollection.findOne({
      $or: [{ email}, { login}],
    });
    return foundUser;
  },

  async getByConfirmationCode(code: string): Promise<UserDBType | null> {
    const foundUser = await usersCollection.findOne({
      "emailConfirmation.confirmationCode": code,
    });
    return foundUser;
  },

  async updateConfirmation(_id: ObjectId): Promise<UserDBType | null> {
    const updatedUser = await usersCollection.findOneAndUpdate(
      { _id },
      { $set: { "emailConfirmation.isConfirmed": true } }
    );

    return updatedUser;
  },
};
