import { ObjectId } from "mongodb";
import { CommentDBType } from "../cloud_DB";
import { ApiError } from "../helper/api-errors";
import { PostInputModel, UserViewModel } from "../type-models";
import { CommentInputModel } from "../type-models/CommentInputModel";
import { BlogRepository, PostRepository } from "../repositories";
import { CommentModel, PostModel } from "../models";

export class PostService {
  constructor(
    protected blogRepository: BlogRepository,
    protected postRepository: PostRepository
  ) {}

  async removePost(id: string) {
    return await this.postRepository.removePost(id);
  }

  async createPost(data: PostInputModel) {
    const { title, shortDescription, content, blogId } = data;

    const blog = await this.blogRepository.getByIdBlog(blogId);
    if (!blog) {
      throw ApiError.NotFoundError("Blog is not found", [
        `Blog with id ${data.blogId} does not exist`,
      ]);
    }

    const newPost = new PostModel({
      _id: new ObjectId(),
      title: title,
      shortDescription: shortDescription,
      content: content,
      blog: blogId,
      createdAt: new Date().toISOString(),
    });
  
    const createdPost = await newPost.save();
    
    const post = this.postRepository.getByIdPost(createdPost._id.toString());

    if (!createdPost) {
      throw ApiError.NotFoundError("Not found", ["No post found"]);
    }

    return post;
  }

  async updatePost(data: PostInputModel, id: string) {
    const isBlogExist = await this.blogRepository.getByIdBlog(data.blogId);

    if (!isBlogExist) {
      throw ApiError.NotFoundError("Blog is not found", [
        `Blog with id ${data.blogId} does not exist`,
      ]);
    }
    await this.postRepository.updatePost(data, id, isBlogExist.name);

    const post = await this.postRepository.getByIdPost(id);

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
    const post = await this.postRepository.getByIdPost(postId);

    if (!post) {
      throw ApiError.NotFoundError("Post is not found", [
        `Post with id ${postId} does not exist`,
      ]);
    }

    const newComment = new CommentModel({
      _id: new ObjectId(),
      post: postId,
      content: content,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login,
      },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        status: [],
      },
      createdAt: new Date().toISOString(),
    });

    const createdComment = await newComment.save();
    
    if (!createdComment) {
      throw ApiError.NotFoundError("Comment is not found", [
        `Comment does not exist`,
      ]);
    }

    return await this.postRepository.getByIdComment(
      createdComment._id.toString()
    );
  }
}
