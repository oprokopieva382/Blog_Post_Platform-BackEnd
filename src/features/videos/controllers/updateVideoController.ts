import { Request, Response } from "express";
import { db } from "../../../db/db";
import { ParamType } from "..";
import {
  InputVideoType,
  OutputVideoType,
} from "../input-output-types/video-types";
import { OutputErrorsType } from "../input-output-types/output-errors-type";

export const updateVideoController = (
  req: Request<ParamType, {}, InputVideoType>,
  res: Response<OutputVideoType | OutputErrorsType>
) => {
  const videoToUpdateExist: OutputVideoType = db.videos.find(
    (v) => v.id === +req.params.id
  );

  let errors: OutputErrorsType = {
    errorsMessages: [],
  };

  if (!videoToUpdateExist) {
    res.sendStatus(404);
    return;
  }

  if (
    !videoToUpdateExist.author ||
    videoToUpdateExist.author.length === 0 ||
    req.body.author.length > 40
  ) {
    errors.errorsMessages.push({
      message: req.body.author
        ? "max length 40 characters"
        : "author field is required",
      field: "author",
    });
  }

  if (
    !videoToUpdateExist.title ||
     videoToUpdateExist.title.length === 0 ||
    req.body.title.length > 40
  ) {
    errors.errorsMessages.push({
      message: req.body.title
        ? "max length 40 characters"
        : "title field is required",
      field: "title",
    });
  }

  if (req.body.availableResolutions?.length === 0) {
    errors.errorsMessages.push({
      message: "at least one resolution should be added",
      field: "availableResolutions",
    });
  }

  if (
    req.body.minAgeRestriction &&
    (req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 1)
  ) {
    errors.errorsMessages.push({
      message: "the age restriction should be between 1 and 18",
      field: "minAgeRestriction",
    });
  }

  if (errors.errorsMessages.length > 0) {
    res.status(400).json(errors);
    return;
  }

  db.videos = db.videos.map((v) =>
    v.id === +req.params.id ? { ...v, ...req.body } : v
  );

  res.sendStatus(204);
};
