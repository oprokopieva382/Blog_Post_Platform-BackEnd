import { ObjectId } from "mongodb";
import { PostInputModel } from "../type-models";
import { PostDBType } from "../cloud_DB";
import { CommentDBType } from "../cloud_DB/mongo_db_types";
import { CommentModel, PostModel, PostReactionModel } from "../models";
import { LikeStatus } from "../types/LikesStatus";

export class PostRepository {
  async getByIdPost(postId: string): Promise<PostDBType | null> {
    return await PostModel.findOne({
      _id: new ObjectId(postId),
    }).populate("blog");
  }

  async removePost(id: string) {
    return await PostModel.findOneAndDelete({
      _id: new ObjectId(id),
    });
  }

  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ) {
    return await PostModel.create({
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
  }

  async updatePost(data: PostInputModel, id: string, blogName: string) {
    const { title, shortDescription, content, blogId } = data;

    return await PostModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          shortDescription,
          content,
          blogId: new ObjectId(blogId),
          blogName,
        },
      }
    );
  }

  async getByIdComment(id: string): Promise<CommentDBType | null> {
    return await CommentModel.findOne({
      _id: new ObjectId(id),
    }).populate(["post", "status"]);
  }

  async createComment(
    postId: string,
    content: string,
    userId: string,
    userLogin: string
  ): Promise<CommentDBType | null> {
    return await CommentModel.create({
      _id: new ObjectId(),
      post: postId,
      content: content,
      commentatorInfo: {
        userId: userId,
        userLogin: userLogin,
      },
      likesCount: 0,
      dislikesCount: 0,
      status: [],
      createdAt: new Date().toISOString(),
    });
  }

  async getReactionStatus(userId: string, postId: string) {
    return PostReactionModel.findOne({ user: userId, post: postId });
  }

  async dislikePost(postId: string, count: number) {
    return await PostModel.findByIdAndUpdate(
      { _id: new ObjectId(postId) },
      {
        $inc: { dislikesCount: count },
      },
      { new: true }
    );
  }

  async likePost(postId: string, count: number) {
    return await PostModel.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      {
        $inc: { likesCount: count },
      },
      { new: true }
    );
  }

  async createDefaultReaction(userId: string, postId: string) {
    await PostReactionModel.create({
      _id: new ObjectId(),
      user: userId,
      myStatus: LikeStatus.None,
      post: postId,
      createdAt: new Date().toISOString(),
    });
  }

  async updateMyReaction(
    userId: string,
    postId: string,
    myStatus: LikeStatus
  ): Promise<PostDBType | null> {
    return await PostReactionModel.findOneAndUpdate(
      { user: userId, post: postId },
      {
        $set: { myStatus },
      },
      { new: true }
    );
  }

  async addLikedUser(userId: string, createdAt: string, postId: string) {
    return await PostReactionModel.findOneAndUpdate(
      { user: userId, post: postId },
      {
        $push: {
          latestReactions: {
            user: userId,
            addedAt: createdAt,
            //description: "random",
          },
        },
      },
      { new: true, upsert: true }
    ).populate("latestReactions.user", "login _id");
  }
}
