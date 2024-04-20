import { Request, Response } from "express";
import { APIErrorResult } from "../../output-errors-type";
import { ParamType } from ".";
import { PostInputModel, PostViewModel } from "../../models";
import { postsService } from "../../services";
import { postsQueryRepository } from "../../query_repositories";
import { queryFilter } from "../../utils/queryFilter";

export const postsController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const posts = await postsQueryRepository.getAllPosts(
        queryFilter(req.query)
      );

      if (!posts) {
        res.sendStatus(404);
        return;
      }

      res.status(200).json(posts);
    } catch (error) {
      console.error("Error in fetching all posts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const foundPost = await postsService.getByIdPost(req.params.id);

      if (!foundPost) {
        res.sendStatus(404);
        return;
      }

      res.status(200).json(foundPost);
    } catch (error) {
      console.error("Error in fetching post by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  create: async (
    req: Request<{}, {}, PostInputModel>,
    res: Response<PostViewModel | APIErrorResult>
  ) => {
    try {
      const newPost = await postsService.createPost(req.body);

      if (!newPost) {
        res.sendStatus(404);
        return;
      }

      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error in fetching create post:", error);
      res.status(500);
    }
  },

  deleteById: async (req: Request, res: Response<void | APIErrorResult>) => {
    try {
      const postToRemove = await postsService.removePost(req.params.id);

      if (!postToRemove) {
        res.sendStatus(404);
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      console.error("Error in fetching delete post by ID:", error);
      res.status(500);
    }
  },

  update: async (
    req: Request<ParamType, {}, PostInputModel>,
    res: Response<PostViewModel | APIErrorResult>
  ) => {
    try {
      const postToUpdate = await postsService.updatePost(
        req.body,
        req.params.id
      );

      if (!postToUpdate) {
        res.sendStatus(404);
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      console.error("Error in fetching update post by ID:", error);
      res.status(500);
    }
  },
};
