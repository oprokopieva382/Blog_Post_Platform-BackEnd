import Router from "express";
import { getVideosController } from "./controllers/getVideosController";
import { createVideoController } from "./controllers/createVideoController";
import { getByIdVideoController } from "./controllers/getByIdVideoController";
import { updateVideoController } from "./controllers/updateVideoController";
import { deleteVideoController } from "./controllers/deleteVideoController";
import { videosController } from './videosController';
import { db } from "../../db/db";

export const videosRouter = Router();

//videosRouter.get("/", getVideosController)
//videosRouter.get("/:id", getByIdVideoController);
//videosRouter.post("/", createVideoController);
//videosRouter.put("/:id", updateVideoController);
//videosRouter.delete("/:id", deleteVideoController);

videosRouter.get("/", videosController.getAll(db));
videosRouter.get("/:id", videosController.getById(db));
videosRouter.delete("/:id", videosController.deleteById(db));
videosRouter.post("/", videosController.create(db));
videosRouter.put("/:id", videosController.update(db));
