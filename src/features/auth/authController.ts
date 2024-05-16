import { Request, Response } from "express";
import {
  LoginInputModel,
  LoginSuccessViewModel,
  MeViewModel,
} from "../../models";
import { APIErrorResult } from "../../output-errors-type";
import { authService } from "../../services";
import { mapMeToView, mapUserDBToView } from "../../utils/mapDBToView";
import { jwtTokenService } from "../application";
import { usersQueryRepository } from "../../query_repositories";

export const authController = {
  login: async (
    req: Request<{}, {}, LoginInputModel>,
    res: Response<LoginSuccessViewModel | APIErrorResult>
  ) => {
    try {
      const authResult = await authService.loginUser(req.body);

      if (
        !authResult ||
        authResult === 401
        //|| authResult.emailConfirmation.isConfirmed === false
      ) {
        res.sendStatus(401);
        return;
      }

      const user = mapUserDBToView(authResult);
      const accessToken = await jwtTokenService.createAccessToken(user);
      const refreshToken = await jwtTokenService.createRefreshToken(user);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 20000,
      });
      res.status(200).send(accessToken);
    } catch (error) {
      console.error("Error in user login:", error);
      res.status(500);
    }
  },

  me: async (req: Request, res: Response<MeViewModel | APIErrorResult>) => {
    try {
      const me = await usersQueryRepository.getByIdUser(req.user.id);
      if (!me) {
        res.sendStatus(401);
        return;
      }
      res.status(200).send(mapMeToView(me));
    } catch (error) {
      console.error("Error in auth me", error);
      res.status(500);
    }
  },

  registration: async (req: Request, res: Response) => {
    try {
      const registerUser = await authService.registerUser(req.body);

      res.sendStatus(204);
    } catch (error) {
      console.error("Error in auth register user", error);
      res.status(500);
    }
  },

  registrationConfirmation: async (
    req: Request,
    res: Response<null | APIErrorResult>
  ) => {
    try {
      const confirmedUser = await authService.confirmUser(req.body);
      if (!confirmedUser) {
        res.sendStatus(400);
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      console.error("Error in auth registration confirmation user", error);
      res.status(500);
    }
  },

  registrationResending: async (
    req: Request,
    res: Response<null | APIErrorResult>
  ) => {
    try {
      const registerUser = await authService.confirmResentUser(req.body);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error in auth register user", error);
      res.status(500);
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.cookies;
      const token = await authService.logoutUser(refreshToken);
      res.clearCookie("refreshToken");

      res.status(200).send(token);
    } catch (error) {
      console.error("Error in user logout:", error);
      res.status(500);
    }
  },
};
