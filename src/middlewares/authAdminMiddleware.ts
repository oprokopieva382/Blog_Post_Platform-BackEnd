import { NextFunction, Request, Response } from "express";
import { SETTINGS } from "../settings";

export const authAdminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers["authorization"] as string;

  if (!auth) {
    res.status(401).json({
      errorMessages: {
        message: "Auth credentials is incorrect",
      },
    });
    return;
  }

  const bufEncoded = Buffer.from(auth.slice(6), "base64");
  const decodedAuth = bufEncoded.toString("utf8");

  const bufDecoded = Buffer.from(SETTINGS.ADMIN_AUTH, "utf8");
  const encodedAuth = bufDecoded.toString("base64");

  if (auth.slice(6) !== encodedAuth || auth.slice(0, 6) !== "Basic ") {
    res.status(401).json({
      errorMessages: {
        message: "Auth credentials is incorrect",
      },
    });
    return;
  }

  next();
};
