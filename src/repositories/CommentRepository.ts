import { ObjectId } from "mongodb";
import { CommentInputModel } from "../type-models";
import { CommentDBType, ReactionCountDBType } from "../cloud_DB/mongo_db_types";
import { CommentModel, ReactionCountModel } from "../models";

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

  async likeReaction(commentId: string, likeStatus: string, count: number) {
       console.log("count", count);
    const reactionCount = await ReactionCountModel.findOneAndUpdate(
      { commentId },
      {
        $inc: {
          likesCount: count,
        },
      },
      { new: true, upsert: true }
    );

    const { likesCount } = reactionCount;
    console.log("reactionCount", reactionCount);
    console.log(likesCount);

    return await CommentModel.findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          "likesInfo.likesCount": likesCount,
          "likesInfo.myStatus": likeStatus,
        },
      },
      { new: true }
    );
  }

  async dislikeReaction(commentId: string, likeStatus: string, count: number) {
      console.log("count", count);
    const reactionCount = await ReactionCountModel.findOneAndUpdate(
      { commentId },
      {
        $inc: {
          dislikesCount: count,
        },
      },
      { new: true, upsert: true }
    );
 const { dislikesCount } = reactionCount;
    console.log(reactionCount);

    return await CommentModel.findByIdAndUpdate(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          "likesInfo.dislikesCount": dislikesCount,
          "likesInfo.myStatus": likeStatus,
        },
      },
      { new: true }
    );
  }

  async getCommentCount(
    commentId: string
  ): Promise<ReactionCountDBType | null> {
    return await ReactionCountModel.findOne({ commentId });
  }

  async createCommentCount(
    commentId: string
  ): Promise<ReactionCountDBType | null> {
    return await ReactionCountModel.create({ commentId });
  }
}
