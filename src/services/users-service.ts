import { ObjectId } from "mongodb";
import { UserInputModel } from "../models";
import { usersRepository } from "../repositories";
import { bcryptService } from "./bcrypt-service";
import { randomUUID } from "crypto";
import { add } from "date-fns/add";

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
    const insertedId = createdUser.insertedId;

    return usersRepository.getByIdUser(insertedId.toString());
  },

  async removeUser(id: string) {
    return await usersRepository.removeUser(id);
  },
};
