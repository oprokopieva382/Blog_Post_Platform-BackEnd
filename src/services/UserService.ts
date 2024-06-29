import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";
import { add } from "date-fns/add";
import { UserInputModel } from "../type-models";
import { UserRepository } from "../repositories";
import { BcryptService } from "./BcryptService";
import { ApiError } from "../helper/api-errors";
import { UserDBType } from "../cloud_DB";

export class UserService {
  constructor(
    protected userRepository: UserRepository,
    protected bcryptService: BcryptService
  ) {}

  async createUser(data: UserInputModel) {
    const { login, password, email } = data;

    const hashedPassword = await this.bcryptService.createHash(password);

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

    const createdUser = await this.userRepository.createUser(newUser);

    const user = this.userRepository.getByIdUser(createdUser._id.toString());

    if (!user) {
      throw ApiError.UnauthorizedError("Not authorized", [
        "Authorization failed. Can't find user with such id",
      ]);
    }

    return user;
  }

  async removeUser(id: string) {
    return await this.userRepository.removeUser(id);
  }
}
