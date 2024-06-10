import { CommentDBType } from "../cloud_DB/mongo_db_types";
import { ApiError } from "../helper/api-errors";
import { PostInputModel, UserViewModel } from "../models";
import { CommentInputModel } from "../models/CommentInputModel";
import { blogsRepository, postsRepository } from "../repositories";
import { ObjectId } from "mongodb";

export const postsService = {
  async removePost(id: string) {
    return await postsRepository.removePost(id);
  },

  async createPost(data: PostInputModel) {
    const { title, shortDescription, content, blogId } = data;

    const isBlogExist = await blogsRepository.getByIdBlog(blogId);
    if (!isBlogExist) {
      throw ApiError.NotFoundError("Blog is not found", [
        `Blog with id ${data.blogId} does not exist`,
      ]);
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

    const post = postsRepository.getByIdPost(insertedId.toString());

    if (!post) {
      throw ApiError.NotFoundError("Not found", ["No post found"]);
    }

    return post;
  },

  async updatePost(data: PostInputModel, id: string) {
    const isBlogExist = await blogsRepository.getByIdBlog(data.blogId);

    if (!isBlogExist) {
      throw ApiError.NotFoundError("Blog is not found", [
        `Blog with id ${data.blogId} does not exist`,
      ]);
    }
    await postsRepository.updatePost(data, id, isBlogExist.name);

    const post = await postsRepository.getByIdPost(id);

    if (!post) {
      throw ApiError.NotFoundError("Not found", ["No post found"]);
    }
    return post;
  },

  async createPostComment(
    postId: string,
    data: CommentInputModel,
    user: UserViewModel
  ): Promise<CommentDBType | null> {
    const { content } = data;
    const isPostExist = await postsRepository.getByIdPost(postId);

    if (!isPostExist) {
      throw ApiError.NotFoundError("Post is not found", [
        `Post with id ${postId} does not exist`,
      ]);
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
      throw ApiError.NotFoundError("Comment is not found", [
        `Comment does not exist`,
      ]);
    }
    const insertedId = createdComment.insertedId;
    return await postsRepository.getByIdComment(insertedId.toString());
  },
};
