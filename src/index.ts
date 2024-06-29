import { app } from "./app";
import { ConnectMongoDB } from "./cloud_DB";
import { SETTINGS } from "./settings";
import { logger } from "./utils/logger";

const startServer = async () => {
  const environmentStatus = `${SETTINGS.STAGING_ENVIRONMENT_STATUS}`;
  const mongoDBConnected = await ConnectMongoDB(environmentStatus);
  try {
    if (!mongoDBConnected) {
      logger.info(
        `Failed to connect to MongoDB in environment status ${environmentStatus}`
      );
      process.exit(1);
    }
    app.listen(SETTINGS.PORT, () => {
      logger.info(`Server running on ${SETTINGS.PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to connect MongoDB: ${error}`);
    process.exit(1);
  }
};

startServer();
