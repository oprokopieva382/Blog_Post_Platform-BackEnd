import { SETTINGS } from "../settings";
import { logger } from "../utils/logger";
import mongoose from "mongoose";

export const ConnectMongoDB = async (environmentStatus: string) => {
   const mongoURI =
     environmentStatus === `${SETTINGS.TESTING_ENVIRONMENT_STATUS}`
       ? SETTINGS.MONGO_DB_COMPASS
       : SETTINGS.MONGO_DB_ATLAS;
  try {
    await mongoose.connect(mongoURI, {
      dbName: `${SETTINGS.DB_NAME}`,
    });
    logger.info(
      `Connected to MongoDB at ${mongoURI}. Database: ${SETTINGS.DB_NAME}`
    );

    return true;
  } catch (error) {
    logger.error(`Failed to connect MongoDB: ${error}`);
    await mongoose.disconnect();
    return false;
  }
};
