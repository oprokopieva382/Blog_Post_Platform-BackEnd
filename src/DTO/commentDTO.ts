import { CommentDBType } from "../cloud_DB";
import { CommentViewModel } from "../type-models";

class CommentDTO {
  static transform(comment: CommentDBType): CommentViewModel {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: comment.likesInfo.myStatus
      },
      createdAt: comment.createdAt,
    };
  }
}

export { CommentDTO };
