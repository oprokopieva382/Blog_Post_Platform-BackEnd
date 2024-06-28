import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";
import { add } from "date-fns/add";
import { UserInputModel } from "../type-models";
import { userRepository } from "../repositories";
import { bcryptService } from "./BcryptService";
import { ApiError } from "../helper/api-errors";
import { UserDBType } from "../cloud_DB";

class UserService {
  async createUser(data: UserInputModel) {
    const { login, password, email } = data;

    const hashedPassword = await bcryptService.createHash(password);

    const newUser = new UserDBType(
      new ObjectId(),
      login,
      hashedPassword,
      email,
      new Date().toISOString(),
      {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: true,
      }
    );

    const createdUser = await userRepository.createUser(newUser);

    const user = userRepository.getByIdUser(createdUser._id.toString());

    if (!user) {
      throw ApiError.UnauthorizedError("Not authorized", [
        "Authorization failed. Can't find user with such id",
      ]);
    }

    return user;
  }

  async removeUser(id: string) {
    return await userRepository.removeUser(id);
  }
}
export const userService = new UserService();
