// import { Response, Request } from "express";
// import { Video } from "./input-output-types/output-video-types";
// import { DBType } from "../../db/db";
// import { ParamType } from ".";
// import { APIErrorResult } from "./input-output-types/output-errors-type";
// import { CreateVideoInputModel } from "./models/CreateVideoInputModel";
// import { UpdateVideoInputModel } from "./models/UpdateVideoInputModel";
// import { createValidation } from "../../utils/createValidation";
// import { updateValidation } from "../../utils/updateValidation";

// export const videosController = {
//   getAll: (db: DBType) => {
//     return (req: Request, res: Response<Video[]>) => {
//       res.status(200).json(db.videos);
//     };
//   },

//   getById: (db: DBType) => {
//     return (req: Request<ParamType>, res: Response<Video | APIErrorResult>) => {
//       const foundVideo = db.videos.find((v) => v.id === +req.params.id);

//       if (!foundVideo) {
//         res.sendStatus(404);
//         return;
//       }

//       res.status(200).json(foundVideo);
//     };
//   },

//   deleteById: (db: DBType) => {
//     return (req: Request<ParamType>, res: Response<void | APIErrorResult>) => {
//       const videoToDelete = db.videos.find((v) => v.id === +req.params.id);

//       if (!videoToDelete) {
//         res.sendStatus(404);
//         return;
//       }

//       db.videos = db.videos.filter((v) => v.id !== +req.params.id);

//       res.sendStatus(204);
//     };
//   },

//   create: (db: DBType) => {
//     return (
//       req: Request<{}, {}, CreateVideoInputModel>,
//       res: Response<Video | APIErrorResult>
//     ) => {
//       const errors = createValidation(req.body);

//       if (errors.errorsMessages.length > 0) {
//         res.status(400).json(errors);
//         return;
//       }

//       const newVideo = {
//         id: Math.floor(Date.now() + Math.random() * 1000000),
//         ...req.body,
//         canBeDownloaded: false,
//         minAgeRestriction: null,
//         createdAt: new Date().toISOString(),
//         publicationDate: new Date(
//           Date.now() + 24 * 60 * 60 * 1000
//         ).toISOString(),
//       };

//       db.videos = [...db.videos, newVideo];
//       res.status(201).json(newVideo);
//     };
//   },

//   update: (db: DBType) => {
//     return (
//       req: Request<ParamType, {}, UpdateVideoInputModel>,
//       res: Response<Video | APIErrorResult>
//     ) => {
//       const videoToUpdateExist: Video = db.videos.find(
//         (v) => v.id === +req.params.id
//       );

//       if (!videoToUpdateExist) {
//         res.sendStatus(404);
//         return;
//       }

//       const errors = updateValidation(req.body);
      
//       if (errors.errorsMessages.length > 0) {
//         res.status(400).json(errors);
//         return;
//       }
//       console.log(errors);
//       db.videos = db.videos.map((v) =>
//         v.id === +req.params.id ? { ...v, ...req.body } : v
//       );

//       res.sendStatus(204);
//     };
//   },
// };
