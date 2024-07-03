import { CommentDBType } from "../cloud_DB";
import { commentQueryRepository } from "../composition-root";
import { CommentViewModel } from "../type-models";
import { LikeStatus } from "../types/LikesStatus";

class CommentDTO {
  static async transform(
    comment: CommentDBType,
    userId?: string
  ): Promise<CommentViewModel> {
    let userStatus: LikeStatus = LikeStatus.None;
    
    console.log("1. userId", userId);
    if (userId) {
      const status = await commentQueryRepository.getUserReactionStatus(
        userId,
        comment._id.toString()
      );
      userStatus = status ? status.myStatus : LikeStatus.None;
    }
    console.log("2. comment", comment);
    console.log("3. userStatus", userStatus);
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
        myStatus: userStatus,
      },
      createdAt: comment.createdAt,
    };
  }
}

export { CommentDTO };
