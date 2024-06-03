import { Request, Response } from "express";
import { APIErrorResult } from "../../output-errors-type";
import { CommentInputModel, CommentViewModel } from "../../models";
import { commentsQueryRepository } from "../../query_repositories";
import { commentDTO } from "../../utils/mapDBToView";
import { commentsService } from "../../services";
import { CommentParamType } from ".";

export const commentsController = {
  getById: async (req: Request, res: Response) => {
    try {
      const foundComment = await commentsQueryRepository.getByIdComment(
        req.params.id
      );

      if (!foundComment) {
        res.sendStatus(404);
        return;
      }

      res.status(200).json(commentDTO(foundComment));
    } catch (error) {
      console.error("Error in fetching comment by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteById: async (req: Request, res: Response<void | APIErrorResult>) => {
    try {
      const commentToRemove = await commentsService.removeComment(
        req.params.commentId,
        req.user
      );

      if (commentToRemove === 403) {
        res.sendStatus(403);
        return;
      }

      if (!commentToRemove) {
        res.sendStatus(404);
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      console.error("Error in fetching delete comment by ID:", error);
      res.status(500);
    }
  },

  update: async (
    req: Request<CommentParamType, {}, CommentInputModel>,
    res: Response<CommentViewModel | APIErrorResult>
  ) => {
    try {
      const commentToUpdate = await commentsService.updateComment(
        req.body,
        req.params.commentId,
        req.user
      );

      if (commentToUpdate === 403) {
        res.sendStatus(403);
        return;
      }

      if (!commentToUpdate) {
        res.sendStatus(404);
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      console.error("Error in fetching update comment by ID:", error);
      res.status(500);
    }
  },
};
