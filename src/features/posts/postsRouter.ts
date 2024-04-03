import { Router } from "express";
import { postsController } from "./postsController";


export const postsRouter = Router();


postsRouter.get("/", postsController.getAll());
postsRouter.get("/:id", postsController.getById());
postsRouter.post("/", postsController.create());
postsRouter.delete("/:id", postsController.deleteById());