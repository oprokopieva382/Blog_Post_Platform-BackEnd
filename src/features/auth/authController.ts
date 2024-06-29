import { NextFunction, Request, Response } from "express";
import { LoginInputModel } from "../../type-models";
import { formatResponse } from "../../utils/responseFormatter";
import { AuthService } from "../../services";
import { ApiError } from "../../helper/api-errors";
import { AuthDTO } from "../../DTO";
import { UserQueryRepository } from "../../query_repositories";

export class AuthController {
  constructor(
    protected authService: AuthService,
    protected userQueryRepository: UserQueryRepository
  ) {}

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const me = await this.userQueryRepository.getByIdUser(req.user.id);
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
      const { accessToken, refreshToken } = await this.authService.loginUser(
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
      await this.authService.registerUser(req.body);

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
      await this.authService.confirmUser(req.body);

      formatResponse(res, 204, {}, "User confirmation made successfully");
    } catch (error) {
      next(error);
    }
  }

  async registrationResending(req: Request, res: Response, next: NextFunction) {
    try {
      await this.authService.confirmResentUser(req.body);
      formatResponse(res, 204, {}, "Registration link resent");
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await this.authService.logoutUser(req.deviceId);

      formatResponse(res, 204, {}, "User logout successfully");
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { newAccessToken, newRefreshToken } =
        await this.authService.refreshToken(req.deviceId, req.userId!);

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
      await this.authService.passwordRecovery(req.body.email);

      formatResponse(res, 204, {}, "Email sent with recovery code inside");
    } catch (error) {
      next(error);
    }
  }

  async setNewPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await this.authService.setNewPassword(req.body);

      formatResponse(res, 204, {}, "New password created");
    } catch (error) {
      next(error);
    }
  }
}
