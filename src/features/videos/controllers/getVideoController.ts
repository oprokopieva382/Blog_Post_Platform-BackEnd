import { Request, Response } from "express";
import { db } from "../../../db/db";

export const getVideoController = () => {
  (req: Request, res: Response) => {
    res.status(200).json(db.videos);
  };
};
