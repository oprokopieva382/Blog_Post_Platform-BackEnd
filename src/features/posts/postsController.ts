import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts-repository";
import { PostInputModel } from "../../models/PostInputModel";
import { PostViewModel } from "../../models/PostViewModel";
import { APIErrorResult } from "../../output-errors-type";
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
      const foundPost = postsRepository.getByIdPost(req.params.id);

      if (!foundPost) {
        res.sendStatus(404);
        return;
      }

      res.status(200).json(foundPost);
    };
  },

  deleteById: () => {
    return async (
      req: Request<ParamType>,
      res: Response<void | APIErrorResult>
    ) => {
      const postToRemove = postsRepository.removePost(+req.params.id);

      if (!postToRemove) {
        res.sendStatus(404);
        return;
      }

      res.sendStatus(204);
    };
  },

  create: () => {
    return (
      req: Request<{}, {}, PostInputModel>,
      res: Response<PostViewModel | APIErrorResult>
    ) => {
      const newPost = postsRepository.createPost(req.body);

      res.status(201).json(newPost);
    };
  },

  update: () => {
    return (
      req: Request<ParamType, {}, PostInputModel>,
      res: Response<PostViewModel | APIErrorResult>
    ) => {
      const postToUpdate = postsRepository.updatePost(req.body, req.params.id);

      if (!postToUpdate) {
        res.sendStatus(404);
        return;
      }

      res.sendStatus(204);
    };
  },
};
