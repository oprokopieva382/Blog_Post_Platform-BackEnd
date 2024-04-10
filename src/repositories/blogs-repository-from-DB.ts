import { blogsCollection } from "../cloud_DB/mongo_db_atlas";

export const blogsRepository = {
  async getAllBlogs() {
    try {
      const blogs = await blogsCollection.find().toArray();
      return blogs;
    } catch (error) {
      console.error("Error in fetching all blogs:", error);
      throw error;
    }
  },
};
