import { Response, Request } from "express";
import { OutputVideoType } from "./input-output-types/video-types";
import { DBType } from "../../db/db";
import { ParamType } from ".";
import { OutputErrorsType } from "./input-output-types/output-errors-type";

export const VideoController = {
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
};
