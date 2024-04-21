import { ObjectId } from "mongodb";
import {UserInputModel,} from "../models";
import { usersRepository } from "../repositories";

export const usersService = {
  async createUser(data: UserInputModel) {
    const newUser = {
      _id: new ObjectId(),
      createdAt: new Date().toISOString(),
      ...data,
    };
    const createdUser = await usersRepository.createUser(newUser);
    const insertedId = createdUser.insertedId;

    const createdUserExist = usersRepository.getByIdUser(insertedId.toString());
    return createdUserExist;
  },

  //   async removeBlog(id: string) {
  //     const blogToDelete = await blogsRepository.removeBlog(id);
  //     return blogToDelete;
  //   },
};
