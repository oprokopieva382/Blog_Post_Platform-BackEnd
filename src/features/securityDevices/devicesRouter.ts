import { Router } from "express";
import { devicesController } from "./devicesController";


export const devicesRouter = Router();

devicesRouter.get("/", devicesController.getAll);
