import Router from "express";
import { getVideosController } from "./controllers/getVideosController";
import { createVideoController } from "./controllers/createVideoController";
import { getByIdVideoController } from "./controllers/getByIdVideoController";
import { updateVideoController } from "./controllers/updateVideoController";
import { deleteVideoController } from "./controllers/deleteVideoController";
import { VideoController } from './VideoController';
import { db } from "../../db/db";

export const videosRouter = Router();

//videosRouter.get("/", getVideosController)
//videosRouter.get("/:id", getByIdVideoController);
videosRouter.post("/", createVideoController);
videosRouter.put("/:id", updateVideoController);
//videosRouter.delete("/:id", deleteVideoController);

videosRouter.get("/", VideoController.getAll(db));
videosRouter.get("/:id", VideoController.getById(db));
videosRouter.delete("/:id", VideoController.deleteById(db));
