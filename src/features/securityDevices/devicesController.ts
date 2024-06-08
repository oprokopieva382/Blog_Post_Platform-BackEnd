import { NextFunction, Response, Request } from "express";
import { ApiError } from "../../helper/api-errors";
import { formatResponse } from "../../utils/responseDTO";
import { devicesQueryRepository } from "../../query_repositories";

export const devicesController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await devicesQueryRepository.getAllDevices();

      if (result.length === 0) {
        throw ApiError.NotFoundError("Not found", ["No devices found"]);
      }

      formatResponse(res, 200, result, "Devices retrieved successfully");
    } catch (error) {
      next(error);
    }
  },
};
