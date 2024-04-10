import { MongoClient } from "mongodb";
import { SETTINGS } from "../settings";

let client = new MongoClient(SETTINGS.MONGO_DB_ATLAS);
export let db = client.db(SETTINGS.DB_NAME);

export const blogsCollection = db.collection(SETTINGS.BLOGS_COLLECTION)
export const postsCollection = db.collection(SETTINGS.POSTS_COLLECTION)

export const runMongoDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    return true;
  } catch (error) {
    console.log(error);
    await client.close();
    return false;
  }
};
