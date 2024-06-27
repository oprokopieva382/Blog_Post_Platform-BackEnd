import { Router } from "express";
import { devicesController } from "./DevicesController";
import { isAuthorizedRefreshToken } from "../../middlewares";

export const devicesRouter = Router();

devicesRouter.get("/", isAuthorizedRefreshToken, devicesController.getAll);
devicesRouter.delete(
  "/:deviceId",
  isAuthorizedRefreshToken,
  devicesController.deleteById
);
devicesRouter.delete("/", isAuthorizedRefreshToken, devicesController.delete);
