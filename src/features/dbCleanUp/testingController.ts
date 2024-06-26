import { Request, Response } from "express";
import {
  ApiCallModel,
  BlogModel,
  CommentModel,
  PostModel,
  SessionModel,
  UserModel,
} from "../../models";

export const testingController = async (req: Request, res: Response) => {
  try {
    await BlogModel.deleteMany({});
    await PostModel.deleteMany({});
    await UserModel.deleteMany({});
    await CommentModel.deleteMany({});
    await ApiCallModel.deleteMany({});
    await SessionModel.deleteMany({});
    res.sendStatus(204);
  } catch (error) {
    console.error("Error in fetching delete all data:", error);
    res.status(500);
  }
};
