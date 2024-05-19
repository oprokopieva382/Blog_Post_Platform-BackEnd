import { Response, Request, NextFunction } from "express";
import { jwtTokenService } from "../features/application";

export const tokensRefreshValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.refreshToken;
  console.log(req.headers.cookie);
  console.log("__________________----___________________________________")
  console.log(req.cookies)
  if (!token) {
    res.sendStatus(401);
    // .json({
    //   errorMessages: {
    //     message:
    //       "JWT refreshToken inside cookie is missing, expired or incorrect",
    //   },
    // });
    return;
  }

  const isValid = await jwtTokenService.validateRefreshToken(
    token.refreshToken
  );

  if (!isValid) {
    res.sendStatus(401);
    // .json({
    //   errorMessage: {
    //     message:
    //       "JWT refreshToken inside cookie is missing, expired or incorrect",
    //   },
    // });
    // return;
  }

  if (typeof token.refreshToken !== "string") {
    res.sendStatus(401);
    // .json({
    //   errorMessage: {
    //     message:
    //       "JWT refreshToken inside cookie is missing, expired or incorrect",
    //   },
    // });
    return;
  }
  req.user = isValid;
  next();
};
