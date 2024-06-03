import { Request, Response } from "express";
import { UserInputModel, UserViewModel } from "../../models";
import { APIErrorResult } from "../../output-errors-type";
import { usersService } from "../../services";
import { userDTO } from "../../utils/mapDBToView";
import { usersQueryRepository } from "../../query_repositories";
import { userQueryFilter } from "../../utils/queryFilter";

export const usersController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const users = await usersQueryRepository.getAllUsers(
        userQueryFilter(req.query)
      );

      if (!users) {
        res.sendStatus(404);
        return;
      }
      res.status(200).json(users);
    } catch (error) {
      console.error("Error in fetching all users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  create: async (
    req: Request<{}, {}, UserInputModel>,
    res: Response<UserViewModel | APIErrorResult>
  ) => {
    const newUser = await usersService.createUser(req.body);

    if (!newUser) {
      res.sendStatus(404);
      return;
    }
    res.status(201).json(userDTO(newUser));
  },

  deleteById: async (req: Request, res: Response<void | APIErrorResult>) => {
    try {
      const userToRemove = await usersService.removeUser(req.params.id);

      if (!userToRemove) {
        res.sendStatus(404);
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      console.error("Error in fetching delete user by ID:", error);
      res.status(500);
    }
  },
};
