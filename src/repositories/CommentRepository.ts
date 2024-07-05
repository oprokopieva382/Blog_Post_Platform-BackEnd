import { ObjectId } from "mongodb";
import { CommentInputModel } from "../type-models";
import { CommentDBType } from "../cloud_DB/mongo_db_types";
import { CommentModel, CommentReactionModel} from "../models";
import { LikeStatus } from "../types/LikesStatus";

export class CommentRepository {
  async getByIdComment(commentId: string): Promise<CommentDBType | null> {
    return await CommentModel.findOne({
      _id: new ObjectId(commentId),
    }).populate({
      path: "status",
      select: "myStatus",
    });
  }

  async getUserReactionStatus(userId: string, commentId: string) {
    return CommentReactionModel.findOne({ user: userId, comment: commentId });
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
        $inc: { likesCount: count },
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
}
