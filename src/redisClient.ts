import { createClient } from "redis";
import { logger } from "./utils/logger";

const redisClient = createClient();

redisClient.on("error", (err) => logger.error("Redis Client Error", err));

(async () => {
  await redisClient.connect();
  logger.info("Redis Client Connected");
})();

export default redisClient;
