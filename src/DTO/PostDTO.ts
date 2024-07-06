import { PostDBType } from "../cloud_DB";
import { postQueryRepository } from "../composition-root";
import { PostViewModel } from "../type-models";
import { LikeStatus } from "../types/LikesStatus";

class PostDTO {
  static async transform(
    post: PostDBType,
    userId?: string
  ): Promise<PostViewModel> {
    let userStatus: LikeStatus = LikeStatus.None;

    if (userId) {
      const reactionInfo = (await postQueryRepository.getReactionStatus(
        userId,
        post._id.toString()
      )) as any;
      userStatus = reactionInfo ? reactionInfo.myStatus : LikeStatus.None;
    }

    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blog._id.toString(),
      blogName: post.blog.name,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: post.likesCount,
        dislikesCount: post.dislikesCount,
        myStatus: userStatus,
      },
    };
  }
}

export { PostDTO };
