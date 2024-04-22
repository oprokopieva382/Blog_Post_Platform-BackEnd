import { Router } from "express";
import { authController } from "./authController";

export const authRouter = Router();

authRouter.post("/",  authController.login);
