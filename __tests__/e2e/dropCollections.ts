import mongoose from "mongoose";
import { logger } from "../../src/utils/logger";

export const dropCollections = async () => {
  try {
    await Promise.all([
      mongoose.connection.collection("blogs").drop(),
      mongoose.connection.collection("comments").drop(),
      mongoose.connection.collection("posts").drop(),
      mongoose.connection.collection("users").drop(),
      mongoose.connection.collection("sessions").drop(),
      mongoose.connection.collection("api-calls").drop(),
      mongoose.connection.collection("password-recovery").drop(),
    ]);
    logger.info("Collections dropped successfully");
  } catch (error) {
    logger.error("Error dropping collections:", error);
  }
};
