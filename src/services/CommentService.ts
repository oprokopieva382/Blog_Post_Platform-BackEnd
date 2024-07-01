import { ApiError } from "../helper/api-errors";
import {
  CommentInputModel,
  LikeInputModel,
  UserViewModel,
} from "../type-models";
import { CommentRepository } from "../repositories";
import {
  ReactionCountDBType,
  ReactionDBType,
} from "../cloud_DB/mongo_db_types";
import { ObjectId } from "mongodb";
import { compareFirstStatusCount } from "../utils/compareStatus";

export class CommentService {
  constructor(protected commentRepository: CommentRepository) {}

  async removeComment(commentId: string, user: UserViewModel) {
    const foundComment = await this.commentRepository.getByIdComment(commentId);

    if (foundComment && user.id !== foundComment.commentatorInfo.userId) {
      throw ApiError.ForbiddenError("Forbidden", [
        "You don't have permission to create comment",
      ]);
    }

    return await this.commentRepository.removeComment(commentId);
  }

  async updateComment(
    data: CommentInputModel,
    commentId: string,
    user: UserViewModel
  ) {
    const comment = await this.commentRepository.getByIdComment(commentId);

    if (!comment) {
      throw ApiError.NotFoundError("Comment to update is not found", [
        `Comment with id ${commentId} does not exist`,
      ]);
    }

    if (comment && user.id !== comment.commentatorInfo.userId) {
      throw ApiError.ForbiddenError("Forbidden", [
        "You don't have permission to update comment",
      ]);
    }

    return await this.commentRepository.updateComment(data, commentId);
  }

  //   async reactToComment(
  //     data: LikeInputModel,
  //     commentId: string,
  //     user: UserViewModel
  //   ) {
  //     const comment = await this.commentRepository.getByIdComment(commentId);

  //     if (!comment) {
  //       throw ApiError.NotFoundError("Comment to react is not found", [
  //         `Comment with id ${commentId} does not exist`,
  //       ]);
  //     }

  //     const reaction = await this.commentRepository.getCommentReaction(
  //       commentId,
  //       user.id
  //     );

  //  const reactionCount = await this.commentRepository.getReactionCount(commentId)

  //     if (!reaction) {
  //       const newReaction = new ReactionDBType(
  //         new ObjectId(),
  //         user.id,
  //         commentId,
  //         data.likeStatus,
  //         new Date().toISOString()
  //       );

  //       const createdReaction = await this.commentRepository.createReaction(newReaction)
  //       const {likeCount, dislikeCount} = compareFirstStatusCount(data.likeStatus);
  //       let count;

  //       if(!reactionCount) {
  //         const newReactionCount = new ReactionCountDBType(
  //           new ObjectId(),
  //           commentId,
  //           likeCount,
  //           dislikeCount
  //         );
  //         count = await this.commentRepository.createReactionCount(
  //           newReactionCount
  //         );
  //       }
  //       return {createdReaction, count}
  //     }

  //     //await this.commentRepository.reactToComment(data, commentId);
  //     return "Yo"
  //   }

  async reactToComment(
    data: LikeInputModel,
    commentId: string,
    user: UserViewModel
  ) {
    const comment = await this.commentRepository.getByIdComment(commentId);

    if (!comment) {
      throw ApiError.NotFoundError("Comment to react is not found", [
        `Comment with id ${commentId} does not exist`,
      ]);
    }
    
    await this.commentRepository.updateReactionCount(data.likeStatus, comment);
  }
}
