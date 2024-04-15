import { Request, Response } from "express";
import { APIErrorResult } from "../../output-errors-type";
import { ParamType } from ".";
import { blogsRepository } from "../../repositories/blogs-repository";
import { BlogInputModel, BlogViewModel } from "../../models";
import { blogsService } from "../../services/blogs-service";

export const blogsController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const blogs = await blogsService.getAllBlogs();
      res.status(200).json(blogs);
    } catch (error) {
      console.error("Error in fetching all blogs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const foundBlog = await blogsRepository.getByIdBlog(req.params.id);

      if (!foundBlog) {
        res.sendStatus(404);
        return;
      }

      res.status(200).json(foundBlog);
    } catch (error) {
      console.error("Error in fetching blog by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteById: async (req: Request, res: Response<void | APIErrorResult>) => {
    try {
      const blogToRemove = await blogsRepository.removeBlog(req.params.id);

      if (!blogToRemove) {
        res.sendStatus(404);
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      console.error("Error in fetching delete blog by ID:", error);
      res.status(500);
    }
  },

  create: async (
    req: Request<{}, {}, BlogInputModel>,
    res: Response<BlogViewModel | APIErrorResult>
  ) => {
    try {
      const newBlog = await blogsRepository.createBlog(req.body);

      if (!newBlog) {
        res.sendStatus(404);
        return;
      }

      res.status(201).json(newBlog);
    } catch (error) {
      console.error("Error in fetching create blog:", error);
      res.status(500);
    }
  },
  update: async (
    req: Request<ParamType, {}, BlogInputModel>,
    res: Response<BlogViewModel | APIErrorResult>
  ) => {
    try {
      const blogToUpdate = await blogsRepository.updateBlog(
        req.body,
        req.params.id
      );

      if (!blogToUpdate) {
        res.sendStatus(404);
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      console.error("Error in fetching update blog by ID:", error);
      res.status(500);
    }
  },
};
