import { Router } from "express";
import { commentsController } from "./commentsController";

export const commentsRouter = Router();

commentsRouter.get("/:id", commentsController.getById);
commentsRouter.delete("/:id", commentsController.deleteById);
commentsRouter.put("/:id", commentsController.update);
