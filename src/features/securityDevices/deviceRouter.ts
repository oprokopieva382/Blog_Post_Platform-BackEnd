import { Router } from "express";
import { isAuthorizedRefreshToken } from "../../middlewares";
import { container } from "../../composition-root";
import { DeviceController } from "./DeviceController";


const deviceController = container.resolve(DeviceController);
export const deviceRouter = Router();

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
