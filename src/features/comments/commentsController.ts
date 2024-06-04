import { NextFunction, Request, Response } from "express";
import { formatResponse } from "../../output-errors-type";
import { CommentInputModel } from "../../models";
import { commentsQueryRepository } from "../../query_repositories";
import { commentDTO } from "../../utils/mapDBToView";
import { commentsService } from "../../services";
import { CommentParamType } from ".";
import { ApiError } from "../../helper/api-errors";

export const commentsController = {
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await commentsQueryRepository.getByIdComment(
        req.params.id
      );

      if (!result) {
        throw ApiError.NotFoundError("Not found", ["No comment found"]);
      }

      formatResponse(
        res,
        200,
        commentDTO(result),
        "Comment retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  },

  deleteById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await commentsService.removeComment(
        req.params.commentId,
        req.user
      );

      if (!result) {
        throw ApiError.NotFoundError("Comment to delete is not found", [
          `Comment with id ${req.params.commentId} does not exist`,
        ]);
      }

      formatResponse(res, 204, {}, "Comment deleted successfully");
    } catch (error) {
      next(error);
    }
  },

  update: async (
    req: Request<CommentParamType, {}, CommentInputModel>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await commentsService.updateComment(
        req.body,
        req.params.commentId,
        req.user
      );

      if (!result) {
        throw ApiError.NotFoundError("Comment to update is not found", [
          `Comment with id ${req.params.commentId} does not exist`,
        ]);
      }

      formatResponse(res, 204, {}, "Comment updated successfully");
    } catch (error) {
      next(error);
    }
  },
};
