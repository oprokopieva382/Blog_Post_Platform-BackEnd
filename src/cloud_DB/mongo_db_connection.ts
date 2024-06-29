import mongoose from "mongoose";
import { SETTINGS } from "../settings";
import { logger } from "../utils/logger";

export const ConnectMongoDB = async (environmentStatus: string) => {
  const dbName =
    environmentStatus === "testing"
      ? SETTINGS.DB_NAME_TESTING
      : SETTINGS.DB_NAME_STAGING;

  try {
    await mongoose.connect(`${SETTINGS.MONGO_DB_ATLAS}`, {
      dbName: dbName,
    });
    logger.info(
      `Connected to MongoDB at ${environmentStatus} environment status. Database: ${dbName}`
    );

    return true;
  } catch (error) {
    logger.error(`Failed to connect MongoDB: ${error}`);
    await mongoose.disconnect();
    return false;
  }
};
