import { NextFunction, Request, Response } from "express";
import { formatResponse } from "../../utils/responseFormatter";
import { ParamType } from ".";
import { PostInputModel, PostViewModel } from "../../type-models";
import { postService } from "../../services";
import {
  PostQueryRepository,
  commentQueryRepository,
} from "../../query_repositories";
import { commentsQueryFilter, queryFilter } from "../../utils/queryFilter";
import { CommentInputModel } from "../../type-models/CommentInputModel";
import { ApiError } from "../../helper/api-errors";
import { CommentDTO, PostDTO } from "../../DTO";

class PostController {
  private postQueryRepository: PostQueryRepository;
  constructor() {
    this.postQueryRepository = new PostQueryRepository();
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.postQueryRepository.getAllPosts(
        queryFilter(req.query)
      );

      if (!result) {
        throw ApiError.NotFoundError("Not found", ["No posts found"]);
      }

      formatResponse(res, 200, result, "Posts retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = (await this.postQueryRepository.getByIdPost(
        req.params.id
      )) as PostViewModel;

      if (!result) {
        throw ApiError.NotFoundError("Not found", ["No post found"]);
      }

      formatResponse(res, 200, result, "Post retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async create(
    req: Request<{}, {}, PostInputModel>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await postService.createPost(req.body);

      if (!result) {
        throw ApiError.NotFoundError(`Post can't be created`);
      }

      formatResponse(
        res,
        201,
        PostDTO.transform(result),
        "Post created successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await postService.removePost(req.params.id);

      if (!result) {
        throw ApiError.NotFoundError("Post to delete is not found", [
          `Post with id ${req.params.id} does not exist`,
        ]);
      }

      formatResponse(res, 204, {}, "Post deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request<ParamType, {}, PostInputModel>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await postService.updatePost(req.body, req.params.id);

      if (!result) {
        throw ApiError.NotFoundError("Post to update is not found", [
          `Post with id ${req.params.id} does not exist`,
        ]);
      }

      formatResponse(res, 204, {}, "Post updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async getPostComments(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await commentQueryRepository.getCommentsOfPost(
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
  }

  async createPostComment(
    req: Request<{ postId: string }, {}, CommentInputModel>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await postService.createPostComment(
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
        CommentDTO.transform(result),
        "Comment created successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}
export const postController = new PostController();
