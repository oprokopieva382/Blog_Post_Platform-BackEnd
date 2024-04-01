import { Request, Response } from "express";

export const postsController = {
  getAll: () => {
    return (req: Request, res: Response) => {
      res.status(200).json({});
    };
  }}