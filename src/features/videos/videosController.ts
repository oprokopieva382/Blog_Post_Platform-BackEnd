import { Response, Request } from "express";
import { InputVideoType, OutputVideoType } from "./input-output-types/video-types";
import { DBType } from "../../db/db";
import { ParamType } from ".";
import { OutputErrorsType } from "./input-output-types/output-errors-type";

export const videosController = {
  getAll: (db: DBType) => {
    return (req: Request, res: Response<OutputVideoType[]>) => {
      res.status(200).json(db.videos);
    };
  },

  getById: (db: DBType) => {
    return (
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
  },

  deleteById: (db: DBType) => {
    return (
      req: Request<ParamType>,
      res: Response<void | OutputErrorsType>
    ) => {
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
      if (
        req.body.minAgeRestriction &&
        req.body.minAgeRestriction > 18 &&
        req.body.minAgeRestriction < 1
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

      const newVideo = {
        id: Math.floor(Date.now() + Math.random() * 1000000),
        title: req.body.title,
        author: req.body.author,
        availableResolutions: req.body.availableResolutions,
        canBeDownloaded: req.body.canBeDownloaded ?? false,
        minAgeRestriction: req.body.minAgeRestriction ?? null,
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
  }
};
