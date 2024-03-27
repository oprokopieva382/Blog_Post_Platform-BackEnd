import { Request, Response } from "express";
import { db } from "../../../db/db";
import {
  InputVideoType,
  OutputVideoType,
} from "../input-output-types/video-types";
import { OutputErrorsType } from "../input-output-types/output-errors-type";

export const createVideoController = (
  req: Request<{}, {}, InputVideoType>,
  res: Response<OutputVideoType | OutputErrorsType>
) => {
  let errors: OutputErrorsType = {
    errorsMessages: [],
  };

  if (!req.body.author) {
    errors.errorsMessages.push({
      message: "author field is required",
      field: "author",
    });
  }

  if (!req.body.title) {
    errors.errorsMessages.push({
      message: "title field is required",
      field: "title",
    });
  }

    if (errors.errorsMessages.length > 0) {
      res.status(400).json(errors);
      return;
    }

  const newVideo = {
    id: Math.floor(Date.now() + Math.random() * 1000000),
    title: req.body.title,
    author: req.body.author,
    availableResolutions: req.body.availableResolutions,
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
  };

  db.videos.push(newVideo);
  res.status(201).json(newVideo);
};
