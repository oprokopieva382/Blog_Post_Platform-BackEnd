import { NextFunction, Request, Response } from "express";
import { ApiError } from "../helper/api-errors";
import { formatResponse } from "../utils/responseFormatter";
import { logger } from "../utils/logger";

export const errorHandlerMiddleware = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error: ${err.message}`);
  if (err instanceof ApiError) {
    return formatResponse(res, err.status, {}, err.message, err.errorsMessages);
  }
  return formatResponse(res, 500, {}, "Internal Server Error", [
    { message: err.message, field: "" },
  ]);
};
