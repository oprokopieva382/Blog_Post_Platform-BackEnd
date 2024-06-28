import { NextFunction, Request, Response } from "express";
import { UserInputModel } from "../../type-models";
import { formatResponse } from "../../utils/responseFormatter";
import { UserService } from "../../services";
import { userQueryFilter } from "../../utils/queryFilter";
import { ApiError } from "../../helper/api-errors";
import { UserDTO } from "../../DTO";
import { UserQueryRepository } from "../../query_repositories";

export class UserController {
  private userQueryRepository: UserQueryRepository;
  private userService: UserService;
  constructor() {
    this.userQueryRepository = new UserQueryRepository();
    this.userService = new UserService();
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userQueryRepository.getAllUsers(
        userQueryFilter(req.query)
      );

      if (!result) {
        throw ApiError.NotFoundError("Not found", ["No users found"]);
      }

      formatResponse(res, 200, result, "Users retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async create(
    req: Request<{}, {}, UserInputModel>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await this.userService.createUser(req.body);

      if (!result) {
        throw ApiError.NotFoundError(`User can't be created`);
      }

      formatResponse(
        res,
        201,
        UserDTO.transform(result),
        "User created successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userService.removeUser(req.params.id);

      if (!result) {
        throw ApiError.NotFoundError("User to delete is not found", [
          `User with id ${req.params.id} does not exist`,
        ]);
      }

      formatResponse(res, 204, {}, "User deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
