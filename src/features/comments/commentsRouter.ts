import { Router } from "express";
import { commentsController } from "./commentsController";

export const commentsRouter = Router();

commentsRouter.get("/:id", commentsController.getById);
commentsRouter.delete("/:commentId", commentsController.deleteById);
commentsRouter.put("/:commentId", commentsController.update);
