import { ObjectId } from "mongodb";
import { BlogDBType, PostDBType } from "../cloud_DB";
import {
  BlogInputModel,
  BlogPostInputModel,
  BlogViewModel,
  PostViewModel,
} from "../models";
import { blogsRepository, postsRepository } from "../repositories";

export const blogsService = {
  async removeBlog(id: string) {
    const blogToDelete = await blogsRepository.removeBlog(id);
    return blogToDelete ? mapBlogDBToView(blogToDelete) : null;
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
  ): Promise<PostViewModel | null> {
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
    return createdPostExist ? mapBlogPostsToView(createdPostExist) : null;
  },
};

const mapBlogDBToView = (blog: BlogDBType): BlogViewModel => {
  return {
    // Convert ObjectId to string
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: false,
  };
};

//help function to convert DBType to ViewType
const mapBlogPostsToView = (post: PostDBType): PostViewModel => {
  return {
    // Convert ObjectId to string
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId.toString(),
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
};
