import { ApiError } from "../helper/api-errors";
import { CommentInputModel, UserViewModel } from "../type-models";
import { CommentRepository } from "../repositories";

export class CommentService {
  private commentRepository: CommentRepository;
  constructor() {
    this.commentRepository = new CommentRepository();
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
    const isCommentExist = await this.commentRepository.getByIdComment(commentId);

    if (!isCommentExist) {
      throw ApiError.NotFoundError("Comment to update is not found", [
        `Comment with id ${commentId} does not exist`,
      ]);
    }

    const foundComment = await this.commentRepository.getByIdComment(commentId);

    if (foundComment && user.id !== foundComment.commentatorInfo.userId) {
      throw ApiError.ForbiddenError("Forbidden", [
        "You don't have permission to create comment",
      ]);
    }

    await this.commentRepository.updateComment(data, commentId);

    return await this.commentRepository.getByIdComment(commentId);
  }
}
