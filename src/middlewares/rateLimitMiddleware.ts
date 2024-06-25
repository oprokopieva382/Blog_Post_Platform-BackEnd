import { NextFunction, Request, Response } from "express";
import { subSeconds } from "date-fns/subSeconds";
import { ApiError } from "../helper/api-errors";
import { ApiDBType } from "../cloud_DB/mongo_db_types";
import { ApiCallModel } from "../models1";

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const IP = req.ip;
    const URL = req.originalUrl;
    const currentTime = new Date();
    const tenSecAgo = subSeconds(currentTime, 10);

    //count requests
    const requestCount = await ApiCallModel.countDocuments({
      IP,
      URL,
      date: { $gte: tenSecAgo },
    });

    if (requestCount >= 5) {
      throw ApiError.TooManyRequestsError("Too Many Requests", [
        "More than 5 attempts from one IP-address during 10 seconds",
      ]);
    }

    //store request in DB
    await ApiCallModel.create({
      IP,
      URL,
      date: currentTime,
    } as ApiDBType);

    next();
  } catch (error) {
    next(error);
  }
};
