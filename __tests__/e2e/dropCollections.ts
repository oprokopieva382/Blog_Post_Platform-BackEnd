import {
  blogsCollection,
  commentsCollection,
  postsCollection,
  usersCollection,
} from "../../src/cloud_DB";
import {
  apiLimitCollection,
  sessionsCollection,
} from "../../src/cloud_DB/mongo_db_atlas";
import { logger } from "../../src/utils/logger";

export const dropCollections = async () => {
  try {
    await Promise.all([
      blogsCollection.drop(),
      postsCollection.drop(),
      commentsCollection.drop(),
      usersCollection.drop(),
      sessionsCollection.drop(),
      apiLimitCollection.drop(),
    ]);
    logger.info("Collections dropped successfully");
  } catch (error) {
    logger.error("Error dropping collections:", error);
  }
};
