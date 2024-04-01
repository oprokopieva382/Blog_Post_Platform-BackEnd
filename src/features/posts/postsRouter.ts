import { Router } from "express";
import { postsController } from "./postsController";

export const postsRouter = Router();


postsRouter.get("/", postsController.getAll());