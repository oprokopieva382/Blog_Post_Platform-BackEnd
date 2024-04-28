import { Request, Response } from "express";
import { LoginInputModel, LoginSuccessViewModel, UserViewModel } from "../../models";
import { APIErrorResult } from "../../output-errors-type";
import { authService} from "../../services";
import { mapUserDBToView } from "../../utils/mapDBToView";
import { jwtService } from "../application";

export const authController = {
  login: async (
    req: Request<{}, {}, LoginInputModel>,
    res: Response<LoginSuccessViewModel | APIErrorResult>
  ) => {
    try {
      const authResult = await authService.loginUser(req.body);
    
      if (!authResult || authResult === 401) {
        res.sendStatus(401);
        return;
      }

      const user = mapUserDBToView(authResult);
      const token = await jwtService.createJWT(user)

      res.sendStatus(200).send(token);
    } catch (error) {
      console.error("Error in user login:", error);
      res.status(500);
    }
  },
};
