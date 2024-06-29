import { Router } from "express";
import { isAuthorizedRefreshToken } from "../../middlewares";
import { deviceController } from "../../composition-root";

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
