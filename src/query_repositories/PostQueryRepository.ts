import { ObjectId } from "mongodb";
import { PostDBType } from "../cloud_DB";
import { Paginator, PostViewModel } from "../type-models";
import { QueryType } from "../types/query-type";
import { PostDTO } from "../DTO";
import { PostModel, PostReactionModel } from "../models";

export class PostQueryRepository {
  async getAllPosts(
    query: QueryType,
    userId?: string
  ): Promise<Paginator<PostViewModel>> {
    const totalPostsCount = await PostModel.countDocuments();

    const posts: PostDBType[] = await PostModel.find()
      .populate("blog")
      .populate({
        path: "reactionInfo",
        select: "myStatus",
      })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .sort({ [query.sortBy]: query.sortDirection })
      .lean();

    const postsToView = {
      pagesCount: Math.ceil(totalPostsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalPostsCount,
      items: await Promise.all(posts.map((p) => PostDTO.transform(p, userId))),
    };

    return postsToView;
  }

  async getByIdPost(id: string): Promise<PostDBType | null> {
    return await PostModel.findOne({
      _id: new ObjectId(id),
    })
      .populate("blog")
      .populate({
        path: "reactionInfo",
        select: "myStatus",
      });
  }

  async getReactionStatus(userId: string, postId: string) {
    return PostReactionModel.findOne({ user: userId, post: postId });
  }
}
