import { CommentDBType } from "../cloud_DB/mongo_db_types";
import { PostInputModel, UserViewModel } from "../models";
import { CommentInputModel } from "../models/CommentInputModel";
import { blogsRepository, postsRepository } from "../repositories";
import { ObjectId } from "mongodb";

export const postsService = {
  async removePost(id: string) {
    const foundPost = await postsRepository.removePost(id);
    return foundPost;
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

  async createPostComment(
    postId: string,
    data: CommentInputModel,
    user: UserViewModel
  ): Promise<CommentDBType | null> {
    const { content } = data;
    const isPostExist = await postsRepository.getByIdPost(postId);

    if (!isPostExist) {
      return null;
    }

    const newComment = {
      _id: new ObjectId(),
      postId,
      content,
      commentatorInfo: {
        userId: user.id, 
        userLogin: user.login, 
      },
      createdAt: new Date().toISOString(),
    };

    const createdComment = await postsRepository.createComment(newComment);

    if (!createdComment) {
      return null;
    }
    const insertedId = createdComment.insertedId;
    const createdCommentExist = await postsRepository.getByIdComment(
      insertedId.toString()
    );
    return createdCommentExist;
  },
};
