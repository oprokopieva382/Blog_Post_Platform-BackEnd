import { Request, Response } from "express";
import { DBType } from "../../db/db";

export const postsController = {
  getAll: (db: DBType) => {
    return (req: Request, res: Response) => {
      res.status(200).json(db.posts);
    };
  },
};