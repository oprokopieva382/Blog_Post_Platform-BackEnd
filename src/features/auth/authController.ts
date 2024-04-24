import { Request, Response } from "express";
import { LoginInputModel, UserViewModel } from "../../models";
import { APIErrorResult } from "../../output-errors-type";
import { authService } from "../../services";

export const authController = {
  login: async (
    req: Request<{}, {}, LoginInputModel>,
    res: Response<UserViewModel | APIErrorResult>
  ) => {
    try {
      const authResult = await authService.loginUser(req.body);
      console.log(authResult);

      if (!authResult || authResult === 401) {
        res.sendStatus(401);
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      console.error("Error in user login:", error);
      res.status(500);
    }
  },
};
