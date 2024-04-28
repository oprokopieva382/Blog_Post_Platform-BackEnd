import { CommentInputModel } from "../models";
import { commentsRepository } from "../repositories";

export const commentsService = {
  async removeComment(commentId: string) {
    const foundComment = await commentsRepository.removeComment(commentId);
    return foundComment;
  },

  async updateComment(data: CommentInputModel, commentId: string) {
    const isCommentExist = await commentsRepository.getByIdComment(commentId);

    if (!isCommentExist) {
      return null;
    }
    await commentsRepository.updateComment(data, commentId);

    const updatedComment = await commentsRepository.getByIdComment(commentId);
    return updatedComment;
  },
};
