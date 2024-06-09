import { Request, Response } from "express";
import {
  apiLimitCollection,
  blogsCollection,
  commentsCollection,
  postsCollection,
  sessionsCollection,
  usersCollection,
} from "../../cloud_DB/mongo_db_atlas";

export const testingController = async (req: Request, res: Response) => {
  try {
    await blogsCollection.deleteMany({});
    await postsCollection.deleteMany({});
    await usersCollection.deleteMany({});
    await commentsCollection.deleteMany({});
    await apiLimitCollection.deleteMany({});
    await sessionsCollection.deleteMany({});
    res.sendStatus(204);
  } catch (error) {
    console.error("Error in fetching delete all data:", error);
    res.status(500);
  }
};
