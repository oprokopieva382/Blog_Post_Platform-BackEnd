import { SETTINGS } from "../settings";
import { logger } from "../utils/logger";
import mongoose from "mongoose";

export const ConnectMongoDB = async () => {
  try {
    await mongoose.connect(`${SETTINGS.MONGO_DB_ATLAS}`, {
      dbName: `${SETTINGS.DB_NAME}`,
    });
    logger.info(`Connected to MongoDB Atlas. Database: ${SETTINGS.DB_NAME}`);

    return true;
  } catch (error) {
    logger.error(`Failed to connect MongoDB: ${error}`);
    await mongoose.disconnect();
    return false;
  }
};
