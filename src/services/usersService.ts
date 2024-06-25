import { ObjectId } from "mongodb";
import { UserInputModel } from "../models";
import { usersRepository } from "../repositories";
import { bcryptService } from "./bcryptService";
import { randomUUID } from "crypto";
import { add } from "date-fns/add";
import { ApiError } from "../helper/api-errors";

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
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: true,
      },
    };

    const createdUser = await usersRepository.createUser(newUser);

    const user = usersRepository.getByIdUser(createdUser._id.toString());

    if (!user) {
      throw ApiError.UnauthorizedError("Not authorized", [
        "Authorization failed. Can't find user with such id",
      ]);
    }

    return user;
  },

  async removeUser(id: string) {
    return await usersRepository.removeUser(id);
  },
};
