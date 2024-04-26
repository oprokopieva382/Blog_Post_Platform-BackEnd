import { Request, Response } from "express";
import { APIErrorResult } from "../../output-errors-type";
import {
  BlogInputModel,
  BlogViewModel,

} from "../../models";
import { ParamType } from ".";
import { commentsQueryRepository } from "../../query_repositories";
import { mapCommentDBToView } from "../../utils/mapDBToView";


export const commentsController = {
  getById: async (req: Request, res: Response) => {
    try {
      const foundComment = await commentsQueryRepository.getByIdComment(req.params.id);

      if (!foundComment) {
        res.sendStatus(404);
        return;
      }

      res.status(200).json(mapCommentDBToView(foundComment));
    } catch (error) {
      console.error("Error in fetching blog by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteById: async (req: Request, res: Response<void | APIErrorResult>) => {
    // try {
    //   const blogToRemove = await blogsService.removeBlog(req.params.id);

    //   if (!blogToRemove) {
    //     res.sendStatus(404);
    //     return;
    //   }

    //   res.sendStatus(204);
    // } catch (error) {
    //   console.error("Error in fetching delete blog by ID:", error);
    //   res.status(500);
    // }
  },

  update: async (
    req: Request<ParamType, {}, BlogInputModel>,
    res: Response<BlogViewModel | APIErrorResult>
  ) => {
    // try {
    //   const blogToUpdate = await blogsService.updateBlog(
    //     req.body,
    //     req.params.id
    //   );

    //   if (!blogToUpdate) {
    //     res.sendStatus(404);
    //     return;
    //   }

    //   res.sendStatus(204);
    // } catch (error) {
    //   console.error("Error in fetching update blog by ID:", error);
    //   res.status(500);
    // }
  },

};
