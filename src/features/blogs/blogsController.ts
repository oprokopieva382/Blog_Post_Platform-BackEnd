import { Request, Response } from "express";
import { APIErrorResult } from "../../output-errors-type";
import { ParamType } from ".";
import { blogsRepository } from "../../repositories/blogs-repository";
import { BlogInputModel } from "../../models/BlogInputModel";
import { BlogViewModel } from "../../models/BlogViewModel";

export const blogsController = {
  getAll: () => {
    return (req: Request, res: Response) => {
      const blogs = blogsRepository.getAllBlogs();
      res.status(200).json(blogs);
    };
  },

  getById: () => {
    return (
      req: Request<ParamType>,
      res: Response<BlogViewModel | APIErrorResult>
    ) => {
      const foundBlog = blogsRepository.getByIdBlog(req.params.id);

      if (!foundBlog) {
        res.sendStatus(404);
        return;
      }

      res.status(200).json(foundBlog);
    };
  },

  deleteById: () => {
    return async (
      req: Request<ParamType>,
      res: Response<void | APIErrorResult>
    ) => {
      const blogToRemove = blogsRepository.removeBlog(+req.params.id);

      if (!blogToRemove) {
        res.sendStatus(404);
        return;
      }

      res.sendStatus(204);
    };
  },

  create: () => {
    return (
      req: Request<{}, {}, BlogInputModel>,
      res: Response<BlogViewModel | APIErrorResult>
    ) => {
      const newBlog = blogsRepository.createBlog(req.body);

      res.status(201).json(newBlog);
    };
  },

  update: () => {
    return (
      req: Request<ParamType, {}, BlogInputModel>,
      res: Response<BlogViewModel | APIErrorResult>
    ) => {
      const blogToUpdate = blogsRepository.updateBlog(req.body, req.params.id);

      if (!blogToUpdate) {
        res.sendStatus(404);
        return;
      }

      res.sendStatus(204);
    };
  },
};
