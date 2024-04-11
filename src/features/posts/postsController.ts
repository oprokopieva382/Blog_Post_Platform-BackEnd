import { Request, Response } from "express";
import { PostInputModel } from "../../models/PostInputModel";
import { PostViewModel } from "../../models/PostViewModel";
import { APIErrorResult } from "../../output-errors-type";
import { ParamType } from ".";
import { postsRepository } from "../../repositories/posts-repository-mongodb";

export const postsController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const posts = await postsRepository.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
       console.error("Error in fetching all posts:", error);
       res.status(500).json({ error: "Internal server error" });
    }
  },

};
// getById: () => {
//   return (
//     req: Request<ParamType>,
//     res: Response<PostViewModel | APIErrorResult>
//   ) => {
//     const foundPost = postsRepository.getByIdPost(req.params.id);

//     if (!foundPost) {
//       res.sendStatus(404);
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
//     const postToRemove = postsRepository.removePost(req.params.id);

//     if (!postToRemove) {
//       res.sendStatus(404);
//       return;
//     }

//     res.sendStatus(204);
//   };
// },

// create: () => {
//   return (
//     req: Request<{}, {}, PostInputModel>,
//     res: Response<PostViewModel | APIErrorResult>
//   ) => {
//     const newPost = postsRepository.createPost(req.body);

//     if (!newPost) {
//       res.sendStatus(404);
//       return;
//     }

//     res.status(201).json(newPost);
//   };
// },

// update: () => {
//   return (
//     req: Request<ParamType, {}, PostInputModel>,
//     res: Response<PostViewModel | APIErrorResult>
//   ) => {
//     const postToUpdate = postsRepository.updatePost(req.body, req.params.id);

//     if (!postToUpdate) {
//       res.sendStatus(404);
//       return;
//     }

//     res.sendStatus(204);
//   };
// },
