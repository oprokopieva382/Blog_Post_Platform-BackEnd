import { ApiError } from "../helper/api-errors";
import { CommentInputModel, UserViewModel } from "../type-models";
import { commentRepository } from "../repositories";

class CommentService {
  async removeComment(commentId: string, user: UserViewModel) {
    const foundComment = await commentRepository.getByIdComment(commentId);

    if (foundComment && user.id !== foundComment.commentatorInfo.userId) {
      throw ApiError.ForbiddenError("Forbidden", [
        "You don't have permission to create comment",
      ]);
    }

    return await commentRepository.removeComment(commentId);
  }

  async updateComment(
    data: CommentInputModel,
    commentId: string,
    user: UserViewModel
  ) {
    const isCommentExist = await commentRepository.getByIdComment(commentId);

    if (!isCommentExist) {
      throw ApiError.NotFoundError("Comment to update is not found", [
        `Comment with id ${commentId} does not exist`,
      ]);
    }

    const foundComment = await commentRepository.getByIdComment(commentId);

    if (foundComment && user.id !== foundComment.commentatorInfo.userId) {
      throw ApiError.ForbiddenError("Forbidden", [
        "You don't have permission to create comment",
      ]);
    }

    await commentRepository.updateComment(data, commentId);

    return await commentRepository.getByIdComment(commentId);
  }
}
export const commentService = new CommentService();
