import { PostDBType } from "../cloud_DB";
import { postQueryRepository } from "../composition-root";
import { LikeDetailsViewModel, PostViewModel } from "../type-models";
import { LikeStatus } from "../types/LikesStatus";
import { sortLikes } from "../utils/sortLikes";

class PostDTO {
  static async transform(
    post: PostDBType,
    userId?: string
  ): Promise<PostViewModel> {
    let userStatus: LikeStatus = LikeStatus.None;
    let newestLikes: LikeDetailsViewModel[] = [];

    if (userId) {
      const reactionInfo = (await postQueryRepository.getReactionStatus(
        userId,
        post._id.toString()
      )) as any;
      userStatus = reactionInfo ? reactionInfo.myStatus : LikeStatus.None;
    }

    const postReactions = await postQueryRepository.getPostReactions(
      post._id.toString()
    );

    const sortedLikes = sortLikes(postReactions);

    //console.log("post Likes - ", likes);

    sortedLikes.map((like: any) => {
      newestLikes.push({
        userId: like.user._id.toString(),
        login: like.user.login,
        description: like.description,
        addedAt: like.addedAt,
      });
    });

    //console.log("post latest Likes - ", newestLikes);

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
        newestLikes: newestLikes,
      },
    };
  }
}

export { PostDTO };
