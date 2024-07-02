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

  private async likeReaction(
    commentId: string,
    likeStatus: string,
    myStatus: LikeStatus
  ) {
    if (myStatus === LikeStatus.Dislike && likeStatus === LikeStatus.Like) {
      await this.commentRepository.dislikeReaction(commentId, likeStatus, -1);
      return await this.commentRepository.likeReaction(
        commentId,
        likeStatus,
        1
      );
    }

    if (myStatus === LikeStatus.Like && likeStatus === LikeStatus.Like) {
      return await this.commentRepository.likeReaction(
        commentId,
        LikeStatus.None,
        -1
      );
    }
    return await this.commentRepository.likeReaction(commentId, likeStatus, 1);
  }
  private async dislikeReaction(
    commentId: string,
    likeStatus: string,
    myStatus: LikeStatus
  ) {
    if (myStatus === LikeStatus.Like && likeStatus === LikeStatus.Dislike) {
      await this.commentRepository.likeReaction(commentId, likeStatus, -1);
      return await this.commentRepository.dislikeReaction(
        commentId,
        likeStatus,
        1
      );
    }

    if (myStatus === LikeStatus.Dislike && likeStatus === LikeStatus.Dislike) {
      return await this.commentRepository.dislikeReaction(
        commentId,
        LikeStatus.None,
        -1
      );
    }
    return await this.commentRepository.dislikeReaction(
      commentId,
      likeStatus,
      1
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

  async reactToComment(data: LikeInputModel, commentId: string) {
    const comment = await this.commentRepository.getByIdComment(commentId);

    const { likeStatus } = data;

    if (!comment) {
      throw ApiError.NotFoundError("Comment to react is not found", [
        `Comment with id ${commentId} does not exist`,
      ]);
    }

    const myStatus = comment.likesInfo.myStatus;
    let result;

    switch (likeStatus) {
      case LikeStatus.Like:
        result = await this.likeReaction(commentId, likeStatus, myStatus);
        break;
      case LikeStatus.Dislike:
        result = await this.dislikeReaction(commentId, likeStatus, myStatus);
        break;
    }

    return result;
  }
}
