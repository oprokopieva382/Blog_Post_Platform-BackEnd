import {
  blackListTokenCollection,
  blogsCollection,
  commentsCollection,
  postsCollection,
  usersCollection,
} from "../../src/cloud_DB";

export const dropCollections = async () => {
  try {
    await Promise.all([
      blogsCollection.drop(),
      postsCollection.drop(),
      commentsCollection.drop(),
      usersCollection.drop(),
      await blackListTokenCollection.drop(),
    ]);
    console.log("Collections dropped successfully");
  } catch (error) {
    console.log("Error dropping collections:", error);
  }
};
