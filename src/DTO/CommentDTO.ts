import { CommentDBType } from "../cloud_DB";
import { CommentViewModel } from "../type-models";
import { LikeStatus } from "../types/LikesStatus";

class CommentDTO {
  static transform(comment: CommentDBType, userId?: string): CommentViewModel {
    let userStatus: LikeStatus = LikeStatus.None;
    console.log("comment", comment);
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
        myStatus: comment.likesInfo.status.myStatus
          ? comment.likesInfo.status.myStatus
          : userStatus,
      },
      createdAt: comment.createdAt,
    };
  }
}

export { CommentDTO };
