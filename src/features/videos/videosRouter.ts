import Router from "express";
import { getVideoController } from "./controllers/getVideoController";
import { createVideoController } from "./controllers/createVideoController";
import { getByIdVideoController } from "./controllers/getByIdVideoController";
import { updateVideoController } from "./controllers/updateVideoController";
import { deleteVideoController } from "./controllers/deleteVideoController";

export const videosRouter = Router();

videosRouter.get("/", getVideoController)
videosRouter.get("/:id", getByIdVideoController);
videosRouter.post("/", createVideoController);
videosRouter.put("/:id", updateVideoController);
videosRouter.delete("/id", deleteVideoController);
