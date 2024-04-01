import { Router } from "express";
import { postsController } from "./postsController";
import { db } from "../../db/db";

export const postsRouter = Router();


postsRouter.get("/", postsController.getAll(db));