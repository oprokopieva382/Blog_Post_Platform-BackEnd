import { Router } from "express";
import { devicesController } from "./devicesController";
import { isAuthorizedMiddleware } from "../../middlewares";


export const devicesRouter = Router();

devicesRouter.get("/", isAuthorizedMiddleware, devicesController.getAll);

