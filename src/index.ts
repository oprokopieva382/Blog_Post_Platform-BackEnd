import { app } from "./app";
import { runMongoDB } from "./cloud_DB/mongo_db_atlas";
import { SETTINGS } from "./settings";


const runBackEnd = async () => {
  const mongoDBConnected = await runMongoDB();
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

runBackEnd();
