import { ObjectId } from "mongodb";
import { ApiError } from "../helper/api-errors";
import {
  CommentInputModel,
  LikeInputModel,
  UserViewModel,
} from "../type-models";
import { CommentRepository } from "../repositories";
import { LikeStatus } from "../types/LikesStatus";
import { ReactionModel } from "../models";

export class CommentService {
  constructor(protected commentRepository: CommentRepository) {}

  private async likeComment(
    commentId: string,
    likeStatus: LikeStatus,
    userId: string
  ) {
    const comment = await this.commentRepository.getByIdComment(commentId);
    if (!comment) {
      throw ApiError.NotFoundError("Comment not found", [
        `Comment with id ${commentId} does not exist`,
      ]);
    }
    let myStatus;

    const userReaction = await this.commentRepository.getUserReactionStatus(
      userId,
      commentId
    );

    console.log("1. userReaction from DB", userReaction);

    if (!userReaction) {
      const newReaction = new ReactionModel({
        _id: new ObjectId(),
        user: userId,
        myStatus: LikeStatus.None,
        comment: commentId,
        createdAt: new Date().toISOString(),
      });

      await newReaction.save();
    } else {
      myStatus = userReaction.myStatus;
    }

    console.log("2. myStatus", myStatus);

    if (myStatus === LikeStatus.Dislike && likeStatus === LikeStatus.Like) {
      console.log(
        "3. if myStatus DISLIKE & likeStatus LIKE, set myStatus - ",
        likeStatus
      );

      await this.commentRepository.updateMyReaction(
        userId,
        commentId,
        likeStatus
      );
      await this.commentRepository.dislikeComment(commentId, -1);
      return await this.commentRepository.likeComment(commentId, 1);
    }

    if (myStatus === LikeStatus.Like && likeStatus === LikeStatus.Like) {
      console.log(
        "4. if myStatus LIKE & likeStatus LIKE, set myStatus - ",
        LikeStatus.None
      );

      await this.commentRepository.updateMyReaction(
        userId,
        commentId,
        LikeStatus.None
      );
      return await this.commentRepository.likeComment(commentId, -1);
    }

    console.log(
      "5. if myStatus NONE & likeStatus LIKE, set myStatus - ",
      likeStatus
    );

    await this.commentRepository.updateMyReaction(
      userId,
      commentId,
      likeStatus
    );
    return await this.commentRepository.likeComment(commentId, 1);
  }

  private async dislikeComment(
    commentId: string,
    likeStatus: LikeStatus,
    userId: string
  ) {
    const comment = await this.commentRepository.getByIdComment(commentId);
    if (!comment) {
      throw ApiError.NotFoundError("Comment not found", [
        `Comment with id ${commentId} does not exist`,
      ]);
    }

    let myStatus;

    const userReaction = await this.commentRepository.getUserReactionStatus(
      userId,
      commentId
    );

    console.log("1. userReaction from DB", userReaction);

    if (!userReaction) {
      const newReaction = new ReactionModel({
        _id: new ObjectId(),
        user: userId,
        myStatus: LikeStatus.None,
        comment: commentId,
        createdAt: new Date().toISOString(),
      });

      await newReaction.save();
    } else {
      myStatus = userReaction.myStatus;
    }

    console.log("2. myStatus", myStatus);

    if (myStatus === LikeStatus.Like && likeStatus === LikeStatus.Dislike) {
      console.log(
        "3. if myStatus LIKE & likeStatus DISLIKE, set myStatus - ",
        likeStatus
      );

      await this.commentRepository.updateMyReaction(
        userId,
        commentId,
        likeStatus
      );
      await this.commentRepository.likeComment(commentId, -1);
      return await this.commentRepository.dislikeComment(
        commentId,

        1
      );
    }

    if (myStatus === LikeStatus.Dislike && likeStatus === LikeStatus.Dislike) {
      console.log(
        "4. if myStatus DISLIKE & likeStatus DISLIKE, set myStatus - ",
        LikeStatus.None
      );

      await this.commentRepository.updateMyReaction(
        userId,
        commentId,
        LikeStatus.None
      );
      return await this.commentRepository.dislikeComment(commentId, -1);
    }

    console.log(
      "5. if myStatus NONE & likeStatus DISLIKE, set myStatus - ",
      likeStatus
    );
    await this.commentRepository.updateMyReaction(
      userId,
      commentId,
      likeStatus
    );
    return await this.commentRepository.dislikeComment(commentId, 1);
  }

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

  async getMyCommentReactionStatus(userId: string, commentId: string) {
    const myReactionStatus = await this.commentRepository.getUserReactionStatus(
      userId,
      commentId
    );
    return myReactionStatus ? myReactionStatus.myStatus : LikeStatus.None;
  }

  async reactToComment(
    data: LikeInputModel,
    commentId: string,
    user: UserViewModel
  ) {
    const { likeStatus } = data;
    let result;

    switch (likeStatus) {
      case LikeStatus.Like:
        result = await this.likeComment(commentId, likeStatus, user.id);
        break;
      case LikeStatus.Dislike:
        result = await this.dislikeComment(commentId, likeStatus, user.id);
        break;
      default:
        throw ApiError.BadRequestError("Invalid like status", [
          "Invalid like status provided",
        ]);
    }

    return result;
  }
}
