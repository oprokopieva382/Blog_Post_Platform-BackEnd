import { ObjectId } from "mongodb";
import { BlogInputModel } from "../models";
import {
  BlogDBType,
  PostDBType,
  blogsCollection,
  postsCollection,
} from "../cloud_DB";

export const blogsRepository = {
  async getByIdBlog(id: string): Promise<BlogDBType | null> {
    return await blogsCollection.findOne({
      _id: new ObjectId(id),
    });
  },

  async removeBlog(id: string) {
    return await blogsCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
  },

  async createBlog(newBlog: BlogDBType) {
    return await blogsCollection.insertOne(newBlog);
  },

  async updateBlog(data: BlogInputModel, id: string) {
    const { name, description, websiteUrl } = data;
    await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, description, websiteUrl } }
    );

    return await blogsCollection.findOne({
      _id: new ObjectId(id),
    });
  },

  async createPost(newPost: PostDBType) {
    return await postsCollection.insertOne(newPost);
  },
};
