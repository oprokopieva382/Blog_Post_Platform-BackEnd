import { Response, Request } from "express";
import { Video } from "./input-output-types/output-video-types";
import { DBType } from "../../db/db";
import { ParamType } from ".";
import { APIErrorResult } from "./input-output-types/output-errors-type";
import { CreateVideoInputModel } from "./models/CreateVideoInputModel";
import { UpdateVideoInputModel } from "./models/UpdateVideoInputModel";

export const videosController = {
  getAll: (db: DBType) => {
    return (req: Request, res: Response<Video[]>) => {
      res.status(200).json(db.videos);
    };
  },

  getById: (db: DBType) => {
    return (req: Request<ParamType>, res: Response<Video | APIErrorResult>) => {
      const foundVideo = db.videos.find((v) => v.id === +req.params.id);

      if (!foundVideo) {
        res.sendStatus(404);
        return;
      }

      res.status(200).json(foundVideo);
    };
  },

  deleteById: (db: DBType) => {
    return (req: Request<ParamType>, res: Response<void | APIErrorResult>) => {
      const videoToDelete = db.videos.find((v) => v.id === +req.params.id);

      if (!videoToDelete) {
        res.sendStatus(404);
        return;
      }

      db.videos = db.videos.filter((v) => v.id !== +req.params.id);

      res.sendStatus(204);
    };
  },

  create: (db: DBType) => {
    return (
      req: Request<{}, {}, CreateVideoInputModel>,
      res: Response<Video | APIErrorResult>
    ) => {
      let errors: APIErrorResult = {
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
      if (!req.body.availableResolutions) {
        errors.errorsMessages.push({
          message: "at least one resolution should be added",
          field: "availableResolutions",
        });
      }

      if (errors.errorsMessages.length > 0) {
        res.status(400).json(errors);
        return;
      }

      const newVideo = {
        id: Math.floor(Date.now() + Math.random() * 1000000),
        ...req.body,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(),
      };

      db.videos.push(newVideo);
      res.status(201).json(newVideo);
    };
  },

  update: (db: DBType) => {
    return (
      req: Request<ParamType, {}, UpdateVideoInputModel>,
      res: Response<Video | APIErrorResult>
    ) => {
      const videoToUpdateExist: Video = db.videos.find(
        (v) => v.id === +req.params.id
      );

      let errors: APIErrorResult = {
        errorsMessages: [],
      };

      if (!videoToUpdateExist) {
        res.sendStatus(404);
        return;
      }

      if (
        !videoToUpdateExist.author ||
        (req.body.author && req.body.author.length > 40)
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
        (req.body.title && req.body.title.length > 40)
      ) {
        errors.errorsMessages.push({
          message: req.body.title
            ? "max length 40 characters"
            : "title field is required",
          field: "title",
        });
      }

      if (
        req.body.availableResolutions &&
        req.body.availableResolutions.length === 0
      ) {
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
      console.log(errors);
      db.videos = db.videos.map((v) =>
        v.id === +req.params.id ? { ...v, ...req.body } : v
      );

      res.sendStatus(204);
    };
  },
};
