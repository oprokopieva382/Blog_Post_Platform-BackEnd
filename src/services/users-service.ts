import { ObjectId } from "mongodb";
import { UserInputModel } from "../models";
import { usersRepository } from "../repositories";
import { bcryptService } from "./bcrypt-service";

export const usersService = {
  async createUser(data: UserInputModel) {
    const { login, password, email } = data;

    const hashedPassword = await bcryptService.createHash(password);

    const newUser = {
      _id: new ObjectId(),
      login,
      password: hashedPassword,
      email,
      createdAt: new Date().toISOString(),
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
