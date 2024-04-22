import { ObjectId } from "mongodb";
import { UserDBType } from "../cloud_DB";
import { usersCollection } from "../cloud_DB/mongo_db_atlas";

export const usersRepository = {
  async createUser(newUser: UserDBType) {
    const createdUser = await usersCollection.insertOne(newUser);
    return createdUser;
  },

  async getByIdUser(id: string): Promise<UserDBType | null> {
    const foundUser = await usersCollection.findOne({
      _id: new ObjectId(id),
    });
    return foundUser;
  },

  async getByLoginOrEmail(data: string) {
    return usersCollection.findOne({
      $or: [{ email: data }, { login: data}],
    });
  },

    async removeUser(id: string) {
      const userToDelete = await usersCollection.findOneAndDelete({
        _id: new ObjectId(id),
      });
      return userToDelete;
    },
};
