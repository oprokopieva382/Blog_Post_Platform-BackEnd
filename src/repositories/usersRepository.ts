import { ObjectId } from "mongodb";
import { UserDBType } from "../cloud_DB";
import { UserModel } from "../models";

export const usersRepository = {
  async createUser(newUser: UserDBType) {
    return await UserModel.create(newUser);
  },

  async getByIdUser(id: string): Promise<UserDBType | null> {
    return await UserModel.findOne({
      _id: new ObjectId(id),
    });
  },

  async removeUser(id: string) {
    return await UserModel.findOneAndDelete({
      _id: new ObjectId(id),
    });
  },
};
