import { Request, Response } from "express";
import { UserInputModel, UserViewModel } from "../../models";
import { APIErrorResult } from "../../output-errors-type";
import { usersService } from "../../services";
import { mapUserDBToView } from "../../utils/mapDBToView";

export const usersController = {
  getAll: async (req: Request, res: Response) => {
    try {
    } catch (error) {}
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
    res.status(201).json(mapUserDBToView(newUser));
  },
  deleteById: () => {},
};
