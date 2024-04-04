import { Request, Response } from "express";
import { db } from "../../db/db";

export const testingController = (req: Request, res: Response) => {
  db.blogs = [];
  db.posts = [];
  res.sendStatus(204);
};
