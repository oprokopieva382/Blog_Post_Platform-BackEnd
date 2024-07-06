import { ApiError } from "../helper/api-errors";
import {
  CommentInputModel,
  LikeInputModel,
  UserViewModel,
} from "../type-models";
import { CommentRepository } from "../repositories";
import { LikeStatus } from "../types/LikesStatus";

export class CommentService {
  constructor(protected commentRepository: CommentRepository) {}

  private async likeComment(
    commentId: string,
    likeStatus: LikeStatus,
    userId: string
  ) {
    let myStatus;

    const reaction = (await this.commentRepository.getReactionStatus(
      userId,
      commentId
    )) as any;

    !reaction
      ? await this.commentRepository.createDefaultReaction(userId, commentId)
      : (myStatus = reaction.myStatus);

    if (myStatus === LikeStatus.Like && likeStatus === LikeStatus.Like) {
      return;
    }

    if (myStatus === LikeStatus.Dislike && likeStatus === LikeStatus.Like) {
      await this.commentRepository.updateMyReaction(
        userId,
        commentId,
        likeStatus
      );
      await this.commentRepository.dislikeComment(commentId, -1);
      return await this.commentRepository.likeComment(commentId, 1);
    }

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
    let myStatus;

    const reaction = (await this.commentRepository.getReactionStatus(
      userId,
      commentId
    )) as any;

    !reaction
      ? await this.commentRepository.createDefaultReaction(userId, commentId)
      : (myStatus = reaction.myStatus);

    if (myStatus === LikeStatus.Dislike && likeStatus === LikeStatus.Dislike) {
      return;
    }

    if (myStatus === LikeStatus.Like && likeStatus === LikeStatus.Dislike) {
      await this.commentRepository.updateMyReaction(
        userId,
        commentId,
        likeStatus
      );
      await this.commentRepository.likeComment(commentId, -1);
      return await this.commentRepository.dislikeComment(commentId, 1);
    }

    await this.commentRepository.updateMyReaction(
      userId,
      commentId,
      likeStatus
    );
    return await this.commentRepository.dislikeComment(commentId, 1);
  }

  private async noneComment(
    commentId: string,
    likeStatus: LikeStatus,
    userId: string
  ) {
    let myStatus;

    const reaction = (await this.commentRepository.getReactionStatus(
      userId,
      commentId
    )) as any;

    !reaction
      ? await this.commentRepository.createDefaultReaction(userId, commentId)
      : (myStatus = reaction.myStatus);

    if (myStatus === LikeStatus.Like && likeStatus === LikeStatus.None) {
      await this.commentRepository.updateMyReaction(
        userId,
        commentId,
        likeStatus
      );
      return await this.commentRepository.likeComment(commentId, -1);
    }

    if (myStatus === LikeStatus.Dislike && likeStatus === LikeStatus.None) {
      await this.commentRepository.updateMyReaction(
        userId,
        commentId,
        LikeStatus.None
      );
      return await this.commentRepository.dislikeComment(commentId, -1);
    }
    
    return await this.commentRepository.updateMyReaction(
      userId,
      commentId,
      likeStatus
    );
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
    const myReactionStatus = (await this.commentRepository.getReactionStatus(
      userId,
      commentId
    )) as any;
    return myReactionStatus ? myReactionStatus.myStatus : LikeStatus.None;
  }

  async reactToComment(
    data: LikeInputModel,
    commentId: string,
    user: UserViewModel
  ) {
    const comment = await this.commentRepository.getByIdComment(commentId);
    if (!comment) {
      throw ApiError.NotFoundError("Comment not found", [
        `Comment with id ${commentId} does not exist`,
      ]);
    }

    const { likeStatus } = data;
    let result;

    switch (likeStatus) {
      case LikeStatus.Like:
        result = await this.likeComment(commentId, likeStatus, user.id);
        break;
      case LikeStatus.Dislike:
        result = await this.dislikeComment(commentId, likeStatus, user.id);
        break;
      case LikeStatus.None:
        result = await this.noneComment(commentId, likeStatus, user.id);
        break;
      default:
        throw ApiError.BadRequestError("Invalid like status", [
          "Invalid like status provided",
        ]);
    }

    return result;
  }
}
