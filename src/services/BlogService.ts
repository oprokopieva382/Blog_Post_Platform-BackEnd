import { inject, injectable } from "inversify";
import {  PostDBType } from "../cloud_DB";
import { BlogInputModel, BlogPostInputModel } from "../type-models";
import { BlogRepository, PostRepository } from "../repositories";
import { ApiError } from "../helper/api-errors";

@injectable()
export class BlogService {
  constructor(
    @inject(BlogRepository) protected blogRepository: BlogRepository,
    @inject(PostRepository) protected postRepository: PostRepository
  ) {}

  async removeBlog(id: string) {
    return await this.blogRepository.removeBlog(id);
  }

  async createBlog(data: BlogInputModel) {
    const { name, description, websiteUrl } = data;
    return this.blogRepository.createBlog(name, description, websiteUrl);
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

    return await this.postRepository.createPost(
      title,
      shortDescription,
      content,
      blogId
    );
  }
}
