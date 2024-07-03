import { ObjectId } from "mongodb";
import { CommentInputModel } from "../type-models";
import { CommentDBType, ReactionDBType } from "../cloud_DB/mongo_db_types";
import { CommentModel, ReactionModel } from "../models";
import { LikeStatus } from "../types/LikesStatus";


export class CommentRepository {
  async getByIdComment(commentId: string): Promise<CommentDBType | null> {
    return await CommentModel.findOne({
      _id: new ObjectId(commentId),
    })
      .populate("myStatus")
      .exec();
  }

  async getUserReactionStatus(userId: string, commentId: string) {
    return ReactionModel.findOne({ userId, commentId }).lean();
  }

  async removeComment(commentId: string) {
    return await CommentModel.findOneAndDelete({
      _id: new ObjectId(commentId),
    });
  }

  async updateComment(data: CommentInputModel, commentId: string) {
    const { content } = data;

    const updatedComment = await CommentModel.findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          content,
        },
      },
      { new: true }
    );

    return updatedComment;
  }

  async likeComment(commentId: string, count: number) {
    return await CommentModel.findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      {
        $inc: { "likesInfo.likesCount": count },
      },
      { new: true }
    );
  }

  async dislikeComment(
    commentId: string,

    count: number
  ) {
    return await CommentModel.findByIdAndUpdate(
      { _id: new ObjectId(commentId) },
      {
        $inc: { "likesInfo.dislikesCount": count },
      },
      { new: true }
    );
  }

  async setUserReaction(
    userId: string,
    commentId: string,
    myStatus: LikeStatus
  ): Promise<ReactionDBType | null> {
    return await ReactionModel.findOneAndUpdate(
      { userId, comment: new ObjectId(commentId) },
      {
        $set: {
          myStatus: myStatus,
        },
      },
      { new: true, upsert: true }
    );
  }
}
