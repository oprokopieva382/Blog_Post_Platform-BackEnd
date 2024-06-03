import { NextFunction, Request, Response } from "express";
import { LoginInputModel } from "../../models";
import { formatResponse } from "../../output-errors-type";
import { authService } from "../../services";
import { authDTO, userDTO } from "../../utils/mapDBToView";
import { jwtTokenService } from "../application";
import { usersQueryRepository } from "../../query_repositories";
import { ApiError } from "../../helper/api-errors";

export const authController = {
  login: async (
    req: Request<{}, {}, LoginInputModel>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authResult = await authService.loginUser(req.body);

      const user = userDTO(authResult);
      const accessToken = await jwtTokenService.createAccessToken(user.id);
      const refreshToken = await jwtTokenService.createRefreshToken(user.id);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      });
      formatResponse(res, 200, accessToken, "User logged in successfully");
    } catch (error) {
      next(error);
    }
  },

  me: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const me = await usersQueryRepository.getByIdUser(req.user.id);
      if (!me) {
        throw ApiError.UnauthorizedError("Not authorized", [
          "Authorization failed. Can't find user with such id",
        ]);
      }
      formatResponse(res, 200, authDTO(me), "User authorized");
    } catch (error) {
      next(error);
    }
  },

  registration: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.registerUser(req.body);

      formatResponse(
        res,
        204,
        {},
        "User registered and email with confirmation link sent to email"
      );
    } catch (error) {
      next(error);
    }
  },

  registrationConfirmation: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await authService.confirmUser(req.body);

      formatResponse(res, 204, {}, "User confirmation made successfully");
    } catch (error) {
      next(error);
    }
  },

  registrationResending: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await authService.confirmResentUser(req.body);
      formatResponse(res, 204, {}, "Registration link resent");
    } catch (error) {
      next(error);
    }
  },

  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refreshToken;

      await authService.logoutUser(token.refreshToken);

      formatResponse(res, 204, {}, "User logout successfully");
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refreshToken;

      const { newAccessToken, newRefreshToken } =
        await authService.refreshToken(token.refreshToken, req.userId!);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
      });

      formatResponse(res, 200, newAccessToken, "New access token sent");
    } catch (error) {
      next(error);
    }
  },
};
