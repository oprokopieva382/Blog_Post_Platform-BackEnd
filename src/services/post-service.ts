import { PostInputModel} from "../models";
import { blogsRepository, postsRepository } from "../repositories";
import { ObjectId} from "mongodb";

export const postsService = {
  async removePost(id: string) {
    const foundPost = await postsRepository.removePost(id);
    return foundPost
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

    const createdPostExist = postsRepository.getByIdPost(insertedId.toString());
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