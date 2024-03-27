import { Request, Response } from "express";
import { db } from "../../../db/db";
import { BodyType } from "..";

export const createVideoController = () => {
  (req: Request, res: Response) => {

    //  const newVideo: BodyType = {
    //    id: Number(Date.now() + Math.random()),
    //    title: req.body.title,
    //    author: req.body.author,
    //  };
    //  db.videos.push(newVideo);

    //  res.status(201);
  };
};
