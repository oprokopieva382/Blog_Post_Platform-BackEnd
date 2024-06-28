import { NextFunction, Request, Response } from "express";
import { LoginInputModel } from "../../type-models";
import { formatResponse } from "../../utils/responseFormatter";
import { authService } from "../../services";
import { userQueryRepository } from "../../query_repositories";
import { ApiError } from "../../helper/api-errors";
import { AuthDTO } from "../../DTO";

class AuthController {
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const me = await userQueryRepository.getByIdUser(req.user.id);
      if (!me) {
        throw ApiError.UnauthorizedError("Not authorized", [
          "Authorization failed. Can't find user with such id",
        ]);
      }
      formatResponse(res, 200, AuthDTO.transform(me), "User authorized");
    } catch (error) {
      next(error);
    }
  }

  async login(
    req: Request<{}, {}, LoginInputModel>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { accessToken, refreshToken } = await authService.loginUser(
        req.body,
        req
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      });
      formatResponse(res, 200, accessToken, "User logged in successfully");
    } catch (error) {
      next(error);
    }
  }

  async registration(req: Request, res: Response, next: NextFunction) {
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
  }

  async registrationConfirmation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await authService.confirmUser(req.body);

      formatResponse(res, 204, {}, "User confirmation made successfully");
    } catch (error) {
      next(error);
    }
  }

  async registrationResending(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.confirmResentUser(req.body);
      formatResponse(res, 204, {}, "Registration link resent");
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.logoutUser(req.deviceId);

      formatResponse(res, 204, {}, "User logout successfully");
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { newAccessToken, newRefreshToken } =
        await authService.refreshToken(req.deviceId, req.userId!);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
      });

      formatResponse(res, 200, newAccessToken, "New access token sent");
    } catch (error) {
      next(error);
    }
  }

  async passwordRecovery(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.passwordRecovery(req.body.email);

      formatResponse(res, 204, {}, "Email sent with recovery code inside");
    } catch (error) {
      next(error);
    }
  }

  async setNewPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.setNewPassword(req.body);

      formatResponse(res, 204, {}, "New password created");
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();