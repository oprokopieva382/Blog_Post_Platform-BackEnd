import Router from "express";
import { db } from "../../db/db";
import { videosController } from './videosController';

export const videosRouter = Router();

videosRouter.get("/", videosController.getAll(db));
videosRouter.get("/:id", videosController.getById(db));
videosRouter.delete("/:id", videosController.deleteById(db));
videosRouter.post("/", videosController.create(db));
videosRouter.put("/:id", videosController.update(db));



