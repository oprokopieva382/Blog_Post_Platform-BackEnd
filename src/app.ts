import express, { Request, Response } from "express";
import { SETTINGS } from "./settings";
import { videosRouter } from "./features/videos/videosRouter";
import { getVideosController } from "./features/videos/controllers/getVideosController";
import { db } from "./db/db";
import {
  InputVideoType,
  OutputVideoType,
  Resolutions,
} from "./features/videos/input-output-types/video-types";
import { OutputErrorsType } from "./features/videos/input-output-types/output-errors-type";
import { ParamType } from "./features/videos";

export const app = express();

//use middleware to be able have access to body and query of all needed requests
app.use(express.json());
app.use(SETTINGS.PATH.VIDEOS, videosRouter);

app.get("/", (req, res) => {
  //endpoint to display backend version in use
  res.status(200).json({ version: "1.0" });
});

// app.get(SETTINGS.PATH.VIDEOS, (req, res: Response<OutputVideoType[]>) => {
//   res.status(200).json(db.videos);
// });

// app.get(
//   `${SETTINGS.PATH.VIDEOS}/:id`,
//   (
//     req: Request<ParamType>,
//     res: Response<OutputVideoType[] | OutputErrorsType>
//   ) => {
//     const foundVideo = db.videos.find((v) => v.id === +req.params.id);

//     if (!foundVideo) {
//       res.sendStatus(404);
//       return;
//     }

//     res.status(200).json(foundVideo);
//   }
// );

// app.delete(
//   `${SETTINGS.PATH.VIDEOS}/:id`,
//   (req: Request<ParamType>, res: Response<void | OutputErrorsType>) => {
//     const videoToDelete = db.videos.find((v) => v.id === +req.params.id);

//     if (!videoToDelete) {
//       res.sendStatus(404);
//       return;
//     }

//     db.videos = db.videos.filter((v) => v.id !== +req.params.id);

//     res.sendStatus(204);
//   }
// );

// app.post(
//   SETTINGS.PATH.VIDEOS,
//   (
//     req: Request<{}, {}, InputVideoType>,
//     res: Response<OutputVideoType | OutputErrorsType>
//   ) => {
//     if (!req.body.author) {
//       const error: OutputErrorsType = {
//         errorsMessages: [
//           { message: "author field is required", field: "author" },
//         ],
//       };
//       res.status(400).send(error);
//       return;
//     }
//     if (!req.body.title) {
//       const error: OutputErrorsType = {
//         errorsMessages: [
//           { message: "title field is required", field: "title" },
//         ],
//       };
//       res.status(400).send(error);
//       return;
//     }
//     const newVideo = {
//       id: Math.floor(Date.now() + Math.random() * 1000000),
//       title: req.body.title,
//       author: req.body.author,
//       availableResolutions: req.body.availableResolutions,
//       canBeDownloaded: false,
//       minAgeRestriction: null,
//       createdAt: new Date().toISOString(),
//       publicationDate: new Date().toISOString(),
//     };

//     db.videos.push(newVideo);
//     res.status(201).json(newVideo);
//   }
// );

// app.put(
//   `${SETTINGS.PATH.VIDEOS}/:id`,
//   (
//     req: Request<ParamType, {}, InputVideoType>,
//     res: Response<OutputVideoType | OutputErrorsType>
//   ) => {
//     const videoToUpdateExist = db.videos.find((v) => v.id === +req.params.id);

//     if (!videoToUpdateExist) {
//       res.sendStatus(404);
//       return;
//     }

//     db.videos = db.videos.map((v) =>
//       v.id === +req.params.id ? { ...v, ...req.body } : v
//     );

//     res.sendStatus(204);
//   }
// );


