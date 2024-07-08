import { injectable } from "inversify";
import { ObjectId } from "mongodb";
import { BlogInputModel } from "../type-models";
import { BlogDBType } from "../cloud_DB";
import { BlogModel, PostModel } from "../models";

@injectable()
export class BlogRepository {
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

  async createBlog(name: string, description: string, websiteUrl: string) {
    return await BlogModel.create({
      _id: new ObjectId(),
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: new Date().toISOString(),
    });
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

  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ) {
    return await PostModel.create({
      _id: new ObjectId(),
      title: title,
      shortDescription: shortDescription,
      content: content,
      blog: blogId,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      dislikesCount: 0,
      status: [],
    });
  }
}
