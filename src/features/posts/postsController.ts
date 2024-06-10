import { NextFunction, Request, Response } from "express";
import { formatResponse } from "../../utils/responseDTO";
import { ParamType } from ".";
import { PostInputModel, PostViewModel } from "../../models";
import { postsService } from "../../services";
import {
  commentsQueryRepository,
  postsQueryRepository,
} from "../../query_repositories";
import { commentsQueryFilter, queryFilter } from "../../utils/queryFilter";
import { commentDTO, postDTO } from "../../utils/mapDBToView";
import { CommentInputModel } from "../../models/CommentInputModel";
import { ApiError } from "../../helper/api-errors";

export const postsController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await postsQueryRepository.getAllPosts(
        queryFilter(req.query)
      );

      if (!result) {
        throw ApiError.NotFoundError("Not found", ["No posts found"]);
      }

      formatResponse(res, 200, result, "Posts retrieved successfully");
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await postsQueryRepository.getByIdPost(req.params.id) as PostViewModel;

      if (!result) {
        throw ApiError.NotFoundError("Not found", ["No post found"]);
      }

      formatResponse(res, 200, result, "Post retrieved successfully");
    } catch (error) {
      next(error);
    }
  },

  create: async (
    req: Request<{}, {}, PostInputModel>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await postsService.createPost(req.body);

      if (!result) {
        throw ApiError.NotFoundError(`Post can't be created`);
      }

      formatResponse(res, 201, postDTO(result), "Post created successfully");
    } catch (error) {
      next(error);
    }
  },

  deleteById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await postsService.removePost(req.params.id);

      if (!result) {
        throw ApiError.NotFoundError("Post to delete is not found", [
          `Post with id ${req.params.id} does not exist`,
        ]);
      }

      formatResponse(res, 204, {}, "Post deleted successfully");
    } catch (error) {
      next(error);
    }
  },

  update: async (
    req: Request<ParamType, {}, PostInputModel>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await postsService.updatePost(req.body, req.params.id);

      if (!result) {
        throw ApiError.NotFoundError("Post to update is not found", [
          `Post with id ${req.params.id} does not exist`,
        ]);
      }

      formatResponse(res, 204, {}, "Post updated successfully");
    } catch (error) {
      next(error);
    }
  },

  getPostComments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await commentsQueryRepository.getCommentsOfPost(
        req.params.postId,
        commentsQueryFilter(req.query)
      );

      if (result.items.length === 0 || !result) {
        throw ApiError.NotFoundError("Comments not found", [
          `No comments of postId ${req.params.postId}`,
        ]);
      }

      formatResponse(res, 200, result, "Comments found successfully");
    } catch (error) {
      next(error);
    }
  },

  createPostComment: async (
    req: Request<{ postId: string }, {}, CommentInputModel>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await postsService.createPostComment(
        req.params.postId,
        req.body,
        req.user
      );

      if (!result) {
        throw ApiError.NotFoundError("Not found", [
          `Can't find post with id ${req.params.postId} to create comment`,
        ]);
      }

      formatResponse(
        res,
        201,
        commentDTO(result),
        "Comment created successfully"
      );
    } catch (error) {
      next(error);
    }
  },
};
