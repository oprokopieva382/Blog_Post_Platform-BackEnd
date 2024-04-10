import { Request, Response } from "express";
import { APIErrorResult } from "../../output-errors-type";
import { ParamType } from ".";
import { BlogInputModel } from "../../models/BlogInputModel";
import { BlogViewModel } from "../../models/BlogViewModel";
import { blogsRepository } from "../../repositories/blogs-repository-from-DB";
import { ObjectId } from "mongodb";

export const blogsController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const blogs = await blogsRepository.getAllBlogs();
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
};

// deleteById: () => {
//   return async (
//     req: Request<ParamType>,
//     res: Response<void | APIErrorResult>
//   ) => {
//     const blogToRemove = blogsRepository.removeBlog(req.params.id);

//     if (!blogToRemove) {
//       res.sendStatus(404);
//       return;
//     }

//     res.sendStatus(204);
//   };
// },

// create: () => {
//   return (
//     req: Request<{}, {}, BlogInputModel>,
//     res: Response<BlogViewModel | APIErrorResult>
//   ) => {
//     const newBlog = blogsRepository.createBlog(req.body);

//     res.status(201).json(newBlog);
//   };
// },

// update: () => {
//   return (
//     req: Request<ParamType, {}, BlogInputModel>,
//     res: Response<BlogViewModel | APIErrorResult>
//   ) => {
//     const blogToUpdate = blogsRepository.updateBlog(req.body, req.params.id);

//     if (!blogToUpdate) {
//       res.sendStatus(404);
//       return;
//     }

//     res.sendStatus(204);
//   };
// },
