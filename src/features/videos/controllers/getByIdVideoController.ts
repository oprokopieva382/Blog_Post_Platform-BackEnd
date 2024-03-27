import { Request, Response } from "express";
import { db } from "../../../db/db";
import { ParamType } from "..";
import { OutputErrorsType } from "../input-output-types/output-errors-type";
import { OutputVideoType } from "../input-output-types/video-types";

export const getByIdVideoController = (
  req: Request<ParamType>,
  res: Response<OutputVideoType[] | OutputErrorsType>
) => {
  const foundVideo = db.videos.find((v) => v.id === +req.params.id);

  if (!foundVideo) {
    res.sendStatus(404);
    return;
  }

  res.status(200).json(foundVideo);
};
