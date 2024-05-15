import { ObjectId } from "mongodb";
import { UserDBType } from "../cloud_DB";
import { usersCollection } from "../cloud_DB/mongo_db_atlas";

export const authRepository = {
  async getByLoginOrEmail(data: string): Promise<UserDBType | null> {
    const foundUser = await usersCollection.findOne({
      $or: [{ email: data }, { login: data }],
    });
    return foundUser;
  },

  async getByConfirmationCode(code: string): Promise<UserDBType | null> {
    const foundUser = await usersCollection.findOne({
      "emailConfirmation.confirmationCode": code,
    });
    return foundUser;
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
    const updatedUser = await usersCollection.findOneAndUpdate(
      { _id },
      { $set: { "emailConfirmation.isConfirmed": true } },
      { returnDocument: "after" }
    );

    return updatedUser;
  },
};
