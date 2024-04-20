import { Paginator, PostInputModel, PostViewModel } from "../models";
import { PostDBType, postsCollection } from "../cloud_DB";
import { blogsRepository, postsRepository } from "../repositories";
import { ObjectId, SortDirection } from "mongodb";
import { QueryType } from "../query-type";

export const postsService = {
  async getByIdPost(id: string): Promise<PostViewModel | null> {
    const foundPost = await postsRepository.getByIdPost(id);
    return foundPost ? mapPostDBToView(foundPost) : null;
  },

  async removePost(id: string) {
    const foundPost = await postsRepository.removePost(id);
    return foundPost ? mapPostDBToView(foundPost) : null;
  },

  async createPost(data: PostInputModel) {
    const { title, shortDescription, content, blogId } = data;

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

    const createdPost = await postsRepository.createPost(newPost);
    const insertedId = createdPost.insertedId;

    const createdPostExist = this.getByIdPost(insertedId.toString());
    return createdPostExist;
  },

  async updatePost(data: PostInputModel, id: string) {
    const isBlogExist = await blogsRepository.getByIdBlog(data.blogId);

    if (!isBlogExist) {
      return null;
    }
    await postsRepository.updatePost(data, id, isBlogExist.name);

    const updatedPost = await postsRepository.getByIdPost(id);
    return updatedPost;
  },
};

const mapPostDBToView = (post: PostDBType): PostViewModel => {
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