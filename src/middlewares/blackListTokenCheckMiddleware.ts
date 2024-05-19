import { Response, Request, NextFunction } from "express";
import { blackListTokenCollection } from "../cloud_DB";

export const blackListTokenCheckMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.refreshToken;
 
const isIncluded = await blackListTokenCollection.findOne({ token: token.refreshToken});
console.log(isIncluded);

  if (isIncluded) {
    res.status(401)
    .json({
      errorMessage: {
        message:
          "JWT refreshToken already used",
      },
    });
    return;
  }

  next();
};
