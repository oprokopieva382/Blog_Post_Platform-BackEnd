import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts-repository";
import { PostInputModel } from "../../models/PostInputModel";
import { PostViewModel } from "../../models/PostViewModel";
import { APIErrorResult } from "../../output-errors-type";
import { validation } from "../../utils/validation";
import { ParamType } from ".";

export const postsController = {
  getAll: () => {
    return (req: Request, res: Response) => {
      const posts = postsRepository.getAllPosts();
      res.status(200).json(posts);
    };
  },

  getById: () => {
    return (
      req: Request<ParamType>,
      res: Response<PostViewModel | APIErrorResult>
    ) => {
      const foundPost = postsRepository.getByIdPost(+req.params.id);

      if (!foundPost) {
        res.status(404);
      }

      res.status(200).json(foundPost);
    };
  },

  create: () => {
    return (
      req: Request<{}, {}, PostInputModel>,
      res: Response<PostViewModel | APIErrorResult>
    ) => {
      const errors = validation(req.body);
      const newPost = postsRepository.createPost(req.body);

      if (errors.errorsMessages.length > 0) {
        res.status(400).json(errors);
        return;
      }

      res.status(201).json(newPost);
    };
  },
};
