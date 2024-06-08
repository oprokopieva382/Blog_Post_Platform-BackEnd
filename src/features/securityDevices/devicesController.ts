import { NextFunction, Response, Request } from "express";
import { ApiError } from "../../helper/api-errors";
import { formatResponse } from "../../utils/responseDTO";
import { devicesQueryRepository } from "../../query_repositories";
import { devicesService } from "../../services";

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

  deleteById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      const result = await devicesService.delete(
        req.params.deviceId,
        refreshToken
      );

      if (!result) {
        throw ApiError.NotFoundError("Not found", ["No devices found"]);
      }

      formatResponse(res, 204, result, "Device removed successfully");
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      const result = await devicesService.deleteRest(refreshToken);

      if (!result) {
        throw ApiError.NotFoundError("Not found", ["No devices found"]);
      }

      formatResponse(res, 204, result, "Devices removed successfully");
    } catch (error) {
      next(error);
    }
  },
};
