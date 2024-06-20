import { NextFunction, Request, Response } from "express";
import { UserInputModel } from "../../models";
import { formatResponse } from "../../utils/responseFormatter";
import { usersService } from "../../services";
import { usersQueryRepository } from "../../query_repositories";
import { userQueryFilter } from "../../utils/queryFilter";
import { ApiError } from "../../helper/api-errors";
import { userDTO } from "../../DTO";

export const usersController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await usersQueryRepository.getAllUsers(
        userQueryFilter(req.query)
      );

      if (!result) {
        throw ApiError.NotFoundError("Not found", ["No users found"]);
      }

      formatResponse(res, 200, result, "Users retrieved successfully");
    } catch (error) {
      next(error);
    }
  },

  create: async (
    req: Request<{}, {}, UserInputModel>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await usersService.createUser(req.body);

      if (!result) {
        throw ApiError.NotFoundError(`User can't be created`);
      }

      formatResponse(res, 201, userDTO(result), "User created successfully");
    } catch (error) {
      next(error);
    }
  },

  deleteById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await usersService.removeUser(req.params.id);

      if (!result) {
        throw ApiError.NotFoundError("User to delete is not found", [
          `User with id ${req.params.id} does not exist`,
        ]);
      }

      formatResponse(res, 204, {}, "User deleted successfully");
    } catch (error) {
      next(error);
    }
  },
};
