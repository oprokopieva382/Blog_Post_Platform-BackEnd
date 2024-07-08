import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { CommentInputModel } from "../type-models";
import { CommentDBType } from "../cloud_DB/mongo_db_types";
import { CommentModel, CommentReactionModel } from "../models";
import { LikeStatus } from "../types/LikesStatus";

@injectable()
export class CommentRepository {
  async getByIdComment(commentId: string): Promise<CommentDBType | null> {
    return await CommentModel.findOne({
      _id: new ObjectId(commentId),
    }).populate({
      path: "status",
      select: "myStatus",
    });
  }

  async getReactionStatus(userId: string, commentId: string) {
    return CommentReactionModel.findOne({ user: userId, comment: commentId });
  }

  async removeComment(commentId: string) {
    return await CommentModel.findOneAndDelete({
      _id: new ObjectId(commentId),
    });
  }

  async updateComment(data: CommentInputModel, commentId: string) {
    const { content } = data;

    return await CommentModel.findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          content,
        },
      },
      { new: true }
    );
  }

  async likeComment(commentId: string, count: number) {
    return await CommentModel.findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      {
        $inc: { likesCount: count },
      },
      { new: true }
    );
  }

  async dislikeComment(commentId: string, count: number) {
    return await CommentModel.findByIdAndUpdate(
      { _id: new ObjectId(commentId) },
      {
        $inc: { dislikesCount: count },
      },
      { new: true }
    );
  }

  async updateMyReaction(
    userId: string,
    commentId: string,
    myStatus: LikeStatus
  ): Promise<CommentDBType | null> {
    return await CommentReactionModel.findOneAndUpdate(
      { user: userId, comment: commentId },
      {
        $set: { myStatus },
      },
      { new: true }
    );
  }

  async createDefaultReaction(userId: string, commentId: string) {
    await CommentReactionModel.create({
      _id: new ObjectId(),
      user: userId,
      myStatus: LikeStatus.None,
      comment: commentId,
      createdAt: new Date().toISOString(),
    });
  }
}
