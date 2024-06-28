import { Router } from "express";
import { deviceController } from "./DeviceController";
import { isAuthorizedRefreshToken } from "../../middlewares";

export const deviceRouter = Router();

deviceRouter.get("/", isAuthorizedRefreshToken, deviceController.getAll);
deviceRouter.delete(
  "/:deviceId",
  isAuthorizedRefreshToken,
  deviceController.deleteById
);
deviceRouter.delete("/", isAuthorizedRefreshToken, deviceController.delete);
