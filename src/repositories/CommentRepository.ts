import { ObjectId } from "mongodb";
import { CommentInputModel } from "../type-models";
import {
  CommentDBType,
  ReactionCountDBType,
  ReactionDBType,
} from "../cloud_DB/mongo_db_types";
import { CommentModel, ReactionCountModel, ReactionModel } from "../models";
import { LikeStatus } from "../types/LikesStatus";

export class CommentRepository {
  async getByIdComment(commentId: string): Promise<CommentDBType | null> {
    return await CommentModel.findOne({
      _id: new ObjectId(commentId),
    });
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

  // async getReactionCount(
  //   commentId: string
  // ): Promise<ReactionCountDBType | null> {
  //   return await ReactionCountModel.findOne({
  //     commentId,
  //   });
  // }

  // async createReaction(newReaction: ReactionDBType) {
  //   return await CommentModel.create(newReaction);
  // }

  async setReactionStatus(myStatus: LikeStatus, commentId: string) {
    return await CommentModel.findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          "likesInfo.myStatus": myStatus,
        },
      },
      { new: true }
    );
  }

  async updateReactionCount(likeStatus: LikeStatus, comment: CommentDBType) {
    const myStatus = comment.likesInfo.myStatus;

    if (myStatus === LikeStatus.Dislike && likeStatus === LikeStatus.Like) {
      return await CommentModel.findOneAndUpdate(
        { _id: comment._id },
        {
          $inc: {
            "likesInfo.likesCount": 1,
            "likesInfo.dislikesCount": -1,
          },
        },
        { new: true }
      );
    }

    if (myStatus === LikeStatus.Like && likeStatus === LikeStatus.Dislike) {
      return await CommentModel.findOneAndUpdate(
        { _id: comment._id },
        {
          $inc: {
            "likesInfo.likesCount": -1,
            "likesInfo.dislikesCount": 1,
          },
        },
        { new: true }
      );
    }

    if (likeStatus === LikeStatus.Like) {
      return await CommentModel.findOneAndUpdate(
        { _id: comment._id },
        {
          $inc: {
            "likesInfo.likesCount": 1,
          },
        },
        { new: true }
      );
    }

    if (likeStatus === LikeStatus.Dislike) {
      return await CommentModel.findOneAndUpdate(
        { _id: comment._id },
        {
          $inc: {
            "likesInfo.dislikesCount": -1,
          },
        },
        { new: true }
      );
    }
  }

  async getCommentReaction(
    commentId: string,
    userId: string
  ): Promise<ReactionDBType | null> {
    return await ReactionModel.findOne({
      commentId,
      userId,
    });
  }

  async likeReaction(commentId: string, likeStatus: string) {}

  async dislikeReaction(commentId: string, likeStatus: string) {}

  // async createReactionCount(newReactionCount: ReactionCountDBType) {
  //   return await ReactionCountModel.create(newReactionCount);
  // }
}
