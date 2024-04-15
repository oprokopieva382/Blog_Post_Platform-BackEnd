import { app } from "./app";
import { ConnectMongoDB } from "./cloud_DB";
import { SETTINGS } from "./settings";

const startServer = async () => {
  const mongoDBConnected = await ConnectMongoDB();
  try {
    if (!mongoDBConnected) {
      console.log("Failed to connect to MongoDB Atlas");
      process.exit(1);
    }
    app.listen(SETTINGS.PORT, () => {
      console.log(`Server running on ${SETTINGS.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();
