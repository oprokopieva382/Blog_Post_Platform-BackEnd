import { ObjectId } from "mongodb";
import { BlogInputModel } from "../type-models";
import { BlogDBType, PostDBType } from "../cloud_DB";
import { BlogModel, PostModel } from "../models";

class BlogRepository {
  async getByIdBlog(id: string): Promise<BlogDBType | null> {
    return await BlogModel.findOne({
      _id: new ObjectId(id),
    });
  }

  async removeBlog(id: string) {
    return await BlogModel.findOneAndDelete({
      _id: new ObjectId(id),
    });
  }

  async createBlog(newBlog: BlogDBType) {
    return await BlogModel.create(newBlog);
  }

  async updateBlog(data: BlogInputModel, id: string) {
    const { name, description, websiteUrl } = data;
    await BlogModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, description, websiteUrl } }
    );

    return await BlogModel.findOne({
      _id: new ObjectId(id),
    });
  }

  async createPost(newPost: PostDBType) {
    return await PostModel.create(newPost);
  }
}
export const blogRepository = new BlogRepository();
