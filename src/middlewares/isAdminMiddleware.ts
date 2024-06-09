import { NextFunction, Request, Response } from "express";
import { SETTINGS } from "../settings";
import { ApiError } from "../helper/api-errors";

export const isAdminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = req.headers["authorization"] as string;

    if (!auth) {
      throw ApiError.UnauthorizedError("Not authorized", [
        "You are not authorized for this action",
      ]);
    }

    const bufEncoded = Buffer.from(auth.slice(6), "base64");
    const decodedAuth = bufEncoded.toString("utf8");

    const bufDecoded = Buffer.from(SETTINGS.ADMIN_AUTH, "utf8");
    const encodedAuth = bufDecoded.toString("base64");

    if (auth.slice(6) !== encodedAuth || auth.slice(0, 6) !== "Basic ") {
      throw ApiError.UnauthorizedError("Not authorized", [
        "You are not authorized for this action",
      ]);
    }

    next();
  } catch (error) {
    next(error);
  }
};
