import { Request, Response } from "express";
import { db } from "../../../db/db";
import { ParamType } from "..";
import { OutputErrorsType } from "../input-output-types/output-errors-type";

export const deleteVideoController = 
  (req: Request<ParamType>, res: Response<void | OutputErrorsType>) => {
    const videoToDelete = db.videos.find((v) => v.id === +req.params.id);

    if (!videoToDelete) {
      res.sendStatus(404);
      return;
    }

    db.videos = db.videos.filter((v) => v.id !== +req.params.id);

    res.sendStatus(204);
  }

