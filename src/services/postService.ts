import { ObjectId } from "mongodb";
import { CommentDBType } from "../cloud_DB";
import { ApiError } from "../helper/api-errors";
import { PostInputModel, UserViewModel } from "../type-models";
import { CommentInputModel } from "../type-models/CommentInputModel";
import { blogRepository, postRepository } from "../repositories";

class PostService {
  async removePost(id: string) {
    return await postRepository.removePost(id);
  }

  async createPost(data: PostInputModel) {
    const { title, shortDescription, content, blogId } = data;

    const isBlogExist = await blogRepository.getByIdBlog(blogId);
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

    const createdPost = await postRepository.createPost(newPost);

    const post = postRepository.getByIdPost(createdPost._id.toString());

    if (!post) {
      throw ApiError.NotFoundError("Not found", ["No post found"]);
    }

    return post;
  }

  async updatePost(data: PostInputModel, id: string) {
    const isBlogExist = await blogRepository.getByIdBlog(data.blogId);

    if (!isBlogExist) {
      throw ApiError.NotFoundError("Blog is not found", [
        `Blog with id ${data.blogId} does not exist`,
      ]);
    }
    await postRepository.updatePost(data, id, isBlogExist.name);

    const post = await postRepository.getByIdPost(id);

    if (!post) {
      throw ApiError.NotFoundError("Not found", ["No post found"]);
    }
    return post;
  }

  async createPostComment(
    postId: string,
    data: CommentInputModel,
    user: UserViewModel
  ): Promise<CommentDBType | null> {
    const { content } = data;
    const isPostExist = await postRepository.getByIdPost(postId);

    if (!isPostExist) {
      throw ApiError.NotFoundError("Post is not found", [
        `Post with id ${postId} does not exist`,
      ]);
    }

    const newComment = new CommentDBType(
      new ObjectId(),
      postId,
      content,
      {
        userId: user.id,
        userLogin: user.login,
      },
      new Date().toISOString()
    );

    const createdComment = await postRepository.createComment(newComment);

    if (!createdComment) {
      throw ApiError.NotFoundError("Comment is not found", [
        `Comment does not exist`,
      ]);
    }

    return await postRepository.getByIdComment(createdComment._id.toString());
  }
}
export const postService = new PostService();
