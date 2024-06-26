import { CommentDBType } from "../cloud_DB";
import { CommentViewModel } from "../type-models";

export const commentDTO = (comment: CommentDBType): CommentViewModel => {
  return {
    // Convert ObjectId to string
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
  };
};
