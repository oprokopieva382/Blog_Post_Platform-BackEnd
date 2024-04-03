import { Request, Response } from "express";
import { PostInputModel } from "../../models/PostInputModel";
import { PostViewModel } from "../../models/PostViewModel";
import { APIErrorResult } from "../../output-errors-type";
import { validation } from "../../utils/validation";
import { ParamType } from ".";
import { blogsRepository } from "../../repositories/blogs-repository";
import { BlogInputModel } from "../../models/BlogInputModel";

export const blogsController = {
  getAll: () => {
    return (req: Request, res: Response) => {
      const blogs = blogsRepository.getAllBlogs();
      res.status(200).json(blogs);
    };
  },

  // getById: () => {
  //   return (
  //     req: Request<ParamType>,
  //     res: Response<PostViewModel | APIErrorResult>
  //   ) => {
  //     const foundPost = postsRepository.getByIdPost(+req.params.id);

  //     if (!foundPost) {
  //       res.status(404);
  //       return;
  //     }

  //     res.status(200).json(foundPost);
  //   };
  // },

  // deleteById: () => {
  //   return async (
  //     req: Request<ParamType>,
  //     res: Response<void | APIErrorResult>
  //   ) => {
  //     const postToRemove = postsRepository.removePost(+req.params.id);
 
  //     if (!postToRemove) {
  //       res.status(404);
  //       return;
  //     }

  //     res.sendStatus(204);
  //   };
  // },

  create: () => {
    return (
      req: Request<{}, {}, BlogInputModel>,
      res: Response<PostViewModel | APIErrorResult>
    ) => {
      //const errors = validation(req.body);
      const newBlog = blogsRepository.createBlog(req.body);

      // if (errors.errorsMessages.length > 0) {
      //   res.status(400).json(errors);
      //   return;
      // }

      res.status(201).json(newBlog);
    };
  },

  // update: () => {
  //   return (
  //     req: Request<ParamType, {}, PostInputModel>,
  //     res: Response<PostViewModel | APIErrorResult>
  //   ) => {
  //     const postToUpdate = postsRepository.updatePost(req.body, +req.params.id);

  //     if (!postToUpdate) {
  //       res.sendStatus(404);
  //       return;
  //     }

  //     res.sendStatus(204);
  //   };
  // },
};
