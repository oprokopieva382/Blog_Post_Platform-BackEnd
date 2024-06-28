import { Router } from "express";
import { DeviceController } from "./DeviceController";
import { isAuthorizedRefreshToken } from "../../middlewares";

export const deviceRouter = Router();
const deviceController = new DeviceController();

deviceRouter.get(
  "/",
  isAuthorizedRefreshToken,
  deviceController.getAll.bind(deviceController)
);
deviceRouter.delete(
  "/:deviceId",
  isAuthorizedRefreshToken,
  deviceController.deleteById.bind(deviceController)
);
deviceRouter.delete(
  "/",
  isAuthorizedRefreshToken,
  deviceController.delete.bind(deviceController)
);
