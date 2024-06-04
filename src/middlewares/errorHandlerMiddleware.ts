import { NextFunction, Request, Response } from "express";
import { ApiError } from "../helper/api-errors";
import { formatResponse } from "../output-errors-type";

export const errorHandlerMiddleware = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  if (err instanceof ApiError) {
    return formatResponse(res, err.status, {}, err.message, err.errorsMessages);
  }
  return formatResponse(res, 500, {}, "Internal Server Error", [
    { message: err.message, field: "" },
  ]);
};
