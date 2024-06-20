import { ObjectId } from "mongodb";
import { UserDBType } from "../cloud_DB";
import { usersCollection } from "../cloud_DB/mongo_db_atlas";

export const usersRepository = {
  async createUser(newUser: UserDBType) {
    return await usersCollection.insertOne(newUser);
  },

  async getByIdUser(id: string): Promise<UserDBType | null> {
    return await usersCollection.findOne({
      _id: new ObjectId(id),
    });
  },

  async removeUser(id: string) {
    return await usersCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
  },
};
