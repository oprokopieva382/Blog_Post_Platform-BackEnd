import { Response, Request, NextFunction } from "express";
import { jwtTokenService } from "../features/application";

export const tokensValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401)
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
    res.status(401)
    // .json({
    //   errorMessage: {
    //     message:
    //       "JWT refreshToken inside cookie is missing, expired or incorrect",
    //   },
    // });
    // return;
  }

  if (typeof token.refreshToken !== "string") {
    res.status(401)
    // .json({
    //   errorMessage: {
    //     message:
    //       "JWT refreshToken inside cookie is missing, expired or incorrect",
    //   },
    // });
    return;
  }

  next();
};
