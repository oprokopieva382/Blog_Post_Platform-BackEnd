import { CommentInputModel, UserViewModel } from "../models";
import { commentsRepository } from "../repositories";

export const commentsService = {
  async removeComment(commentId: string, user: UserViewModel) {
    const foundComment = await commentsRepository.getByIdComment(commentId);

    if (foundComment && user.id !== foundComment.commentatorInfo.userId) {
      return 403;
    }

    const commentToRemove = await commentsRepository.removeComment(commentId);
    return commentToRemove;
  },

  async updateComment(data: CommentInputModel, commentId: string, user: UserViewModel) {

    const isCommentExist = await commentsRepository.getByIdComment(commentId);

    if (!isCommentExist) {
      return null;
    }

      const foundComment = await commentsRepository.getByIdComment(commentId);

      if (foundComment && user.id !== foundComment.commentatorInfo.userId) {
        return 403;
      }

    await commentsRepository.updateComment(data, commentId);

    const updatedComment = await commentsRepository.getByIdComment(commentId);
    return updatedComment;
  },
};
