import { NextFunction, Request, Response } from "express";
import { formatResponse } from "../../output-errors-type";
import { ParamType } from ".";
import { BlogInputModel, BlogPostInputModel } from "../../models";
import { blogsService } from "../../services";
import { blogsQueryRepository } from "../../query_repositories";
import { queryFilter } from "../../utils/queryFilter";
import { blogDTO, postDTO } from "../../utils/mapDBToView";
import { ApiError } from "../../helper/api-errors";

export const blogsController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await blogsQueryRepository.getAllBlogs(
        queryFilter(req.query)
      );

      if (!result) {
        throw ApiError.NotFoundError("Not found", ["No blogs found"]);
      }
      formatResponse(res, 200, result, "Blogs retrieved successfully");
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await blogsQueryRepository.getByIdBlog(req.params.id);

      formatResponse(res, 200, result, "Blog retrieved successfully");
    } catch (error) {
      next(error);
    }
  },

  deleteById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await blogsService.removeBlog(req.params.id);

      if (!result) {
        throw ApiError.NotFoundError("Note to delete is not found", [
          `Blog with id ${req.params.id} does not exist`,
        ]);
      }

      formatResponse(res, 204, {}, "Blog deleted successfully");
    } catch (error) {
      next(error);
    }
  },

  create: async (
    req: Request<{}, {}, BlogInputModel>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await blogsService.createBlog(req.body);

      if (!result) {
        throw ApiError.NotFoundError(`Blog can't be created`);
      }

      formatResponse(res, 201, blogDTO(result), "Blog created successfully");
    } catch (error) {
      next(error);
    }
  },

  update: async (
    req: Request<ParamType, {}, BlogInputModel>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await blogsService.updateBlog(req.body, req.params.id);

      if (!result) {
        throw ApiError.NotFoundError("Blog to update is not found", [
          `Blog with id ${req.params.id} does not exist`,
        ]);
      }

      formatResponse(res, 204, {}, "Blog updated successfully");
    } catch (error) {
      next(error);
    }
  },

  getBlogPosts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await blogsQueryRepository.getPostsOfBlog(
        req.params.blogId,
        queryFilter(req.query)
      );

      if (result.items.length === 0 || !result) {
        throw ApiError.NotFoundError("Posts not found", [
          `No posts of blogId ${req.params.blogId}`,
        ]);
      }

      formatResponse(res, 200, result, "Posts found successfully");
    } catch (error) {
      next(error);
    }
  },

  createBlogPost: async (
    req: Request<{ blogId: string }, {}, BlogPostInputModel>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await blogsService.createPost(req.params.blogId, req.body);

      if (!result) {
        throw ApiError.NotFoundError("Not found", [
          `Can't find blog with id ${req.params.blogId} to create post`,
        ]);
      }

      formatResponse(res, 201, postDTO(result), "Post created successfully");
    } catch (error) {
      next(error);
    }
  },
};
