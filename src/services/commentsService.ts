import { ApiError } from "../helper/api-errors";
import { CommentInputModel, UserViewModel } from "../type-models";
import { commentsRepository } from "../repositories";

export const commentsService = {
  async removeComment(commentId: string, user: UserViewModel) {
    const foundComment = await commentsRepository.getByIdComment(commentId);

    if (foundComment && user.id !== foundComment.commentatorInfo.userId) {
      throw ApiError.ForbiddenError("Forbidden", [
        "You don't have permission to create comment",
      ]);
    }

    return await commentsRepository.removeComment(commentId);
  },

  async updateComment(
    data: CommentInputModel,
    commentId: string,
    user: UserViewModel
  ) {
    const isCommentExist = await commentsRepository.getByIdComment(commentId);

    if (!isCommentExist) {
      throw ApiError.NotFoundError("Comment to update is not found", [
        `Comment with id ${commentId} does not exist`,
      ]);
    }

    const foundComment = await commentsRepository.getByIdComment(commentId);

    if (foundComment && user.id !== foundComment.commentatorInfo.userId) {
      throw ApiError.ForbiddenError("Forbidden", [
        "You don't have permission to create comment",
      ]);
    }

    await commentsRepository.updateComment(data, commentId);

    return await commentsRepository.getByIdComment(commentId);
  },
};
