import { NextFunction, Response, Request } from "express";
import { ApiError } from "../../helper/api-errors";
import { formatResponse } from "../../utils/responseFormatter";
import { devicesQueryRepository } from "../../query_repositories";
import { deviceService } from "../../services";

class DeviceController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await devicesQueryRepository.getAllDevices(req.userId);

      if (result.length === 0) {
        throw ApiError.NotFoundError("Not found", ["No devices found"]);
      }

      formatResponse(res, 200, result, "Devices retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await deviceService.delete(
        req.params.deviceId,
        req.userId
      );

      if (!result) {
        throw ApiError.NotFoundError("Not found", ["No devices found"]);
      }

      formatResponse(res, 204, result, "Device removed successfully");
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await deviceService.deleteRest(req.deviceId, req.userId);

      if (!result) {
        throw ApiError.NotFoundError("Not found", ["No devices found"]);
      }

      formatResponse(res, 204, result, "Devices removed successfully");
    } catch (error) {
      next(error);
    }
  }
}

export const deviceController = new DeviceController();
