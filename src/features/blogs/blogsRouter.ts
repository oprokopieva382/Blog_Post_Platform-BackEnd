import { Request, Response, Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { blogsController } from "./blogsController";
import { blogValidationMiddleware } from "../../middlewares/blogValidationMiddleware";
import { ParamType } from ".";
import { BlogInputModel } from "../../models/BlogInputModel";
import { BlogViewModel } from "../../models/BlogViewModel";
import { APIErrorResult } from "../../output-errors-type";

export const blogsRouter = Router();

blogsRouter.get(
  "/",
  async (req, res) => await blogsController.getAll(req, res)
);

blogsRouter.get(
  "/:id",
  async (req, res) => await blogsController.getById(req, res)
);

blogsRouter.delete(
  "/:id",
  authMiddleware,
  async (req, res) => await blogsController.deleteById(req, res)
);

blogsRouter.post(
  "/",
  authMiddleware,
  blogValidationMiddleware,
  async (req, res) => await blogsController.create(req, res)
);

blogsRouter.put(
  "/:id",
  authMiddleware,
  blogValidationMiddleware,
  async (
    req: Request<ParamType, {}, BlogInputModel>,
    res: Response<BlogViewModel | APIErrorResult>
  ) => await blogsController.update(req, res)
);
