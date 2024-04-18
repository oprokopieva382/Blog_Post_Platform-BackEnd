import { ObjectId } from "mongodb";
import { BlogInputModel } from "../models";
import { BlogDBType, PostDBType, blogsCollection, postsCollection } from "../cloud_DB";
import { QueryType } from "../features/blogs";

export const blogsRepository = {
  async getAllBlogs(
    searchQueryName: any,
    query: QueryType
  ): Promise<BlogDBType[]> {
    const blogs: BlogDBType[] = await blogsCollection
      .find(searchQueryName)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .toArray();

    return blogs;
  },

  async getByIdBlog(id: string): Promise<BlogDBType | null> {
    const foundBlog = await blogsCollection.findOne({
      _id: new ObjectId(id),
    });
    return foundBlog;
  },

  async removeBlog(id: string) {
    const blogToDelete = await blogsCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    return blogToDelete;
  },

  async createBlog(newBlog: BlogDBType) {
    const createdBlog = await blogsCollection.insertOne(newBlog);
    return createdBlog;
  },

  async updateBlog(data: BlogInputModel, id: string) {
    const { name, description, websiteUrl } = data;
    await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, description, websiteUrl } }
    );
    const updatedBlog = await blogsCollection.findOne({
      _id: new ObjectId(id),
    });

    return updatedBlog;
  },

  async createPost(newPost: PostDBType) {
    const createdPost = await postsCollection.insertOne(newPost);
    return createdPost;
  },
};
