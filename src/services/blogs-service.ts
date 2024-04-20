import { ObjectId } from "mongodb";
import { PostDBType } from "../cloud_DB";
import { BlogInputModel, BlogPostInputModel } from "../models";
import { blogsRepository, postsRepository } from "../repositories";

export const blogsService = {
  async removeBlog(id: string) {
    const blogToDelete = await blogsRepository.removeBlog(id);
    return blogToDelete;
  },

  async createBlog(data: BlogInputModel) {
    const newBlog = {
      _id: new ObjectId(),
      createdAt: new Date().toISOString(),
      ...data,
    };
    const createdBlog = await blogsRepository.createBlog(newBlog);
    const insertedId = createdBlog.insertedId;

    const createdBlogExist = blogsRepository.getByIdBlog(insertedId.toString());
    return createdBlogExist;
  },

  async updateBlog(data: BlogInputModel, id: string) {
    const updatedBlog = await blogsRepository.updateBlog(data, id);
    return updatedBlog;
  },

  async createPost(
    blogId: string,
    data: BlogPostInputModel
  ): Promise<PostDBType | null> {
    const { title, shortDescription, content } = data;

    const isBlogExist = await blogsRepository.getByIdBlog(blogId);
    if (!isBlogExist) {
      return null;
    }

    const newPost = {
      _id: new ObjectId(),
      title,
      shortDescription,
      content,
      blogId: new ObjectId(blogId),
      blogName: isBlogExist.name,
      createdAt: new Date().toISOString(),
    };

    const createdPost = await blogsRepository.createPost(newPost);

    if (!createdPost) {
      return null;
    }

    const insertedId = createdPost.insertedId;
    const createdPostExist = await postsRepository.getByIdPost(
      insertedId.toString()
    );
    return createdPostExist;
  },
};
