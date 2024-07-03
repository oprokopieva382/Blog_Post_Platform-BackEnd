import { CommentDBType } from "../cloud_DB";
import { ReactionModel } from "../models";
import { CommentViewModel } from "../type-models";
import { LikeStatus } from "../types/LikesStatus";

class CommentDTO {
  static async transform(
    comment: CommentDBType,
    userId?: string
  ): Promise<CommentViewModel> {
    let userStatus: LikeStatus = LikeStatus.None;

    if (userId) {
      const reaction = await ReactionModel.findOne({
        comment: comment._id,
        user: userId,
      });

      if (reaction) {
        userStatus = reaction.myStatus[0];
      }
    }

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

  static async transformMany(
    comments: CommentDBType[],
    userId?: string
  ): Promise<CommentViewModel[]> {
    const transformedComments: CommentViewModel[] = [];

    for (const comment of comments) {
      const transformedComment = await this.transform(comment, userId);
      transformedComments.push(transformedComment);
    }

    return transformedComments;
  }
}

export { CommentDTO };
