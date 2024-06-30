import { ApiError } from "../helper/api-errors";
import {
  CommentInputModel,
  LikeInputModel,
  UserViewModel,
} from "../type-models";
import { CommentRepository } from "../repositories";

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

  // async reactToComment(
  //   data: LikeInputModel,
  //   commentId: string,
  //   user: UserViewModel
  // ) {
  //   const comment = await this.commentRepository.getByIdComment(commentId);

  //   if (!comment) {
  //     throw ApiError.NotFoundError("Comment to react is not found", [
  //       `Comment with id ${commentId} does not exist`,
  //     ]);
  //   }

  //   await this.commentRepository.reactToComment(data, commentId);
  // }
}
