import { ObjectId } from "mongodb";
import { CommentDBType } from "../cloud_DB";
import { ApiError } from "../helper/api-errors";
import { LikeInputModel, PostInputModel, UserViewModel } from "../type-models";
import { CommentInputModel } from "../type-models/CommentInputModel";
import { BlogRepository, PostRepository } from "../repositories";
import { CommentModel, PostModel, PostReactionModel } from "../models";
import { LikeStatus } from "../types/LikesStatus";

export class PostService {
  constructor(
    protected blogRepository: BlogRepository,
    protected postRepository: PostRepository
  ) {}

  private async likePost(
    postId: string,
    likeStatus: LikeStatus,
    userId: string
  ) {
    const post = await this.postRepository.getByIdPost(postId);
    if (!post) {
      throw ApiError.NotFoundError("Post not found", [
        `Post with id ${postId} does not exist`,
      ]);
    }
    let myStatus;

    const reaction = (await this.postRepository.getReactionStatus(
      userId,
      postId
    )) as any;

    if (!reaction) {
      const newReaction = new PostReactionModel({
        _id: new ObjectId(),
        user: userId,
        myStatus: LikeStatus.None,
        post: postId,
        createdAt: new Date().toISOString(),
      });

      await newReaction.save();
    } else {
      myStatus = reaction.myStatus;
    }

    if (myStatus === LikeStatus.Dislike && likeStatus === LikeStatus.Like) {
      await this.postRepository.updateMyReaction(userId, postId, likeStatus);
      await this.postRepository.dislikePost(postId, -1);

      const likedPost = await this.postRepository.likePost(postId, 1);

      const YO = await this.postRepository.addLikedUser(
        userId,
        likedPost!.createdAt,
        postId
      );

      console.log("YO", YO);
      return YO;
    }

    if (myStatus === LikeStatus.Like && likeStatus === LikeStatus.Like) {
      return await this.postRepository.updateMyReaction(
        userId,
        postId,
        LikeStatus.Like
      );
    }

    await this.postRepository.updateMyReaction(userId, postId, likeStatus);
    const likedPost = await this.postRepository.likePost(postId, 1);

    const YO = await this.postRepository.addLikedUser(
      userId,
      likedPost!.createdAt,
      postId
    );
    console.log("YO", YO);
    return YO;
  }

  private async dislikePost(
    postId: string,
    likeStatus: LikeStatus,
    userId: string
  ) {
    const post = await this.postRepository.getByIdPost(postId);
    if (!post) {
      throw ApiError.NotFoundError("Post not found", [
        `Post with id ${postId} does not exist`,
      ]);
    }

    let myStatus;

    const reaction = (await this.postRepository.getReactionStatus(
      userId,
      postId
    )) as any;

    if (!reaction) {
      const newReaction = new PostReactionModel({
        _id: new ObjectId(),
        user: userId,
        myStatus: LikeStatus.None,
        post: postId,
        createdAt: new Date().toISOString(),
      });

      await newReaction.save();
    } else {
      myStatus = reaction.myStatus;
    }

    if (myStatus === LikeStatus.Like && likeStatus === LikeStatus.Dislike) {
      await this.postRepository.updateMyReaction(userId, postId, likeStatus);
      await this.postRepository.likePost(postId, -1);
      return await this.postRepository.dislikePost(postId, 1);
    }

    if (myStatus === LikeStatus.Dislike && likeStatus === LikeStatus.Dislike) {
      return await this.postRepository.updateMyReaction(
        userId,
        postId,
        LikeStatus.Dislike
      );
    }

    await this.postRepository.updateMyReaction(userId, postId, likeStatus);
    return await this.postRepository.dislikePost(postId, 1);
  }

  private async nonePost(
    postId: string,
    likeStatus: LikeStatus,
    userId: string
  ) {
    const post = await this.postRepository.getByIdComment(postId);

    if (!post) {
      throw ApiError.NotFoundError("Post not found", [
        `Post with id ${postId} does not exist`,
      ]);
    }

    let myStatus;

    const reaction = (await this.postRepository.getReactionStatus(
      userId,
      postId
    )) as any;

    if (!reaction) {
      const newReaction = new PostReactionModel({
        _id: new ObjectId(),
        user: userId,
        myStatus: LikeStatus.None,
        post: postId,
        createdAt: new Date().toISOString(),
      });

      await newReaction.save();
    } else {
      myStatus = reaction.myStatus;
    }

    if (myStatus === LikeStatus.Like && likeStatus === LikeStatus.None) {
      await this.postRepository.updateMyReaction(userId, postId, likeStatus);
      return await this.postRepository.likePost(postId, -1);
    }

    if (myStatus === LikeStatus.Dislike && likeStatus === LikeStatus.None) {
      await this.postRepository.updateMyReaction(
        userId,
        postId,
        LikeStatus.None
      );
      return await this.postRepository.dislikePost(postId, -1);
    }
    return await this.postRepository.updateMyReaction(
      userId,
      postId,
      likeStatus
    );
  }

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
      likesCount: 0,
      dislikesCount: 0,
      status: [],
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
      likesCount: 0,
      dislikesCount: 0,
      status: [],
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

  async reactToPost(data: LikeInputModel, postId: string, user: UserViewModel) {
    const { likeStatus } = data;
    let result;

    switch (likeStatus) {
      case LikeStatus.Like:
        result = await this.likePost(postId, likeStatus, user.id);
        break;
      case LikeStatus.Dislike:
        result = await this.dislikePost(postId, likeStatus, user.id);
        break;
      case LikeStatus.None:
        result = await this.nonePost(postId, likeStatus, user.id);
        break;
      default:
        throw ApiError.BadRequestError("Invalid like status", [
          "Invalid like status provided",
        ]);
    }

    return result;
  }
}
