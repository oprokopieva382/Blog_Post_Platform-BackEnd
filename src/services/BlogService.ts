import { ObjectId } from "mongodb";
import { BlogDBType, PostDBType } from "../cloud_DB";
import { BlogInputModel, BlogPostInputModel } from "../type-models";
import { BlogRepository, PostRepository } from "../repositories";
import { ApiError } from "../helper/api-errors";
import { PostModel } from "../models";

export class BlogService {
  constructor(
    protected blogRepository: BlogRepository,
    protected postRepository: PostRepository
  ) {}

  async removeBlog(id: string) {
    return await this.blogRepository.removeBlog(id);
  }

  async createBlog(data: BlogInputModel) {
    const { name, description, websiteUrl } = data;
    const newBlog = new BlogDBType(
      new ObjectId(),
      name,
      description,
      websiteUrl,
      new Date().toISOString()
    );

    const createdBlog = await this.blogRepository.createBlog(newBlog);

    return this.blogRepository.getByIdBlog(createdBlog._id.toString());
  }

  async updateBlog(data: BlogInputModel, id: string) {
    return await this.blogRepository.updateBlog(data, id);
  }

  async createPost(
    blogId: string,
    data: BlogPostInputModel
  ): Promise<PostDBType | null> {
    const { title, shortDescription, content } = data;
    const blog = await this.blogRepository.getByIdBlog(blogId);

    if (!blog) {
      throw ApiError.NotFoundError("Not found", ["No blog found"]);
    }

    const newPost = new PostModel({
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

    const createdPost = await newPost.save();

    const result = await this.postRepository.getByIdPost(
      createdPost._id.toString()
    );

    if (!result) {
      throw ApiError.NotFoundError("Not found", ["No post found"]);
    }

    return result;
  }
}
