import { NextFunction, Request, Response } from "express";
import { formatResponse } from "../../utils/responseFormatter";
import { ParamType } from ".";
import { BlogInputModel, BlogPostInputModel } from "../../type-models";
import { BlogService } from "../../services";
import { queryFilter } from "../../utils/queryFilter";
import { ApiError } from "../../helper/api-errors";
import { BlogDTO, PostDTO } from "../../DTO";
import { BlogQueryRepository } from "../../query_repositories";

export class BlogController {
  constructor(
    protected blogService: BlogService,
    protected blogQueryRepository: BlogQueryRepository
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.blogQueryRepository.getAllBlogs(
        queryFilter(req.query)
      );

      if (!result) {
        throw ApiError.NotFoundError("Not found", ["No blogs found"]);
      }
      formatResponse(res, 200, result, "Blogs retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.blogQueryRepository.getByIdBlog(req.params.id);

      formatResponse(res, 200, result, "Blog retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.blogService.removeBlog(req.params.id);

      if (!result) {
        throw ApiError.NotFoundError("Blog to delete is not found", [
          `Blog with id ${req.params.id} does not exist`,
        ]);
      }

      formatResponse(res, 204, {}, "Blog deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  async create(
    req: Request<{}, {}, BlogInputModel>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await this.blogService.createBlog(req.body);

      if (!result) {
        throw ApiError.NotFoundError(`Blog can't be created`);
      }

      formatResponse(
        res,
        201,
        BlogDTO.transform(result),
        "Blog created successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request<ParamType, {}, BlogInputModel>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await this.blogService.updateBlog(req.body, req.params.id);

      if (!result) {
        throw ApiError.NotFoundError("Blog to update is not found", [
          `Blog with id ${req.params.id} does not exist`,
        ]);
      }

      formatResponse(res, 204, {}, "Blog updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async getBlogPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.blogQueryRepository.getPostsOfBlog(
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
  }

  async createBlogPost(
    req: Request<{ blogId: string }, {}, BlogPostInputModel>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await this.blogService.createPost(
        req.params.blogId,
        req.body
      );

      if (!result) {
        throw ApiError.NotFoundError("Not found", [
          `Can't find blog with id ${req.params.blogId} to create post`,
        ]);
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
}
