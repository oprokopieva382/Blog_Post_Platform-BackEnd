import { CommentInputModel } from "../models";
import { commentsRepository } from "../repositories";

export const commentsService = {
  async removeComment(commentId: string) {
    const foundComment = await commentsRepository.removeComment(commentId);
    return foundComment;
  },

  async updateComment(data: CommentInputModel, id: string) {
    const isCommentExist = await commentsRepository.getByIdComment(id);

    if (!isCommentExist) {
      return null;
    }
    await commentsRepository.updateComment(data, id);

    const updatedComment = await commentsRepository.getByIdComment(id);
    return updatedComment;
  },
};
