import Router from "express";
import { getVideosController } from "./controllers/getVideosController";
import { createVideoController } from "./controllers/createVideoController";
import { getByIdVideoController } from "./controllers/getByIdVideoController";
import { updateVideoController } from "./controllers/updateVideoController";
import { deleteVideoController } from "./controllers/deleteVideoController";

export const videosRouter = Router();

videosRouter.get("/", getVideosController)
videosRouter.get("/:id", getByIdVideoController);
videosRouter.post("/", createVideoController);
videosRouter.put("/:id", updateVideoController);
videosRouter.delete("/id", deleteVideoController);
