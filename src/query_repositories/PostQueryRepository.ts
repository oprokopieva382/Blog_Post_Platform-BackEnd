import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { PostDBType } from "../cloud_DB";
import { QueryType } from "../types/query-type";
import { PostModel, PostReactionModel } from "../models";
import {
  LikeDetailsDBType,
} from "../cloud_DB/mongo_db_types";
import { LikeStatus } from "../types/LikesStatus";

@injectable()
export class PostQueryRepository {
  async getAllPosts(query: QueryType) {
    const totalPostsCount = await PostModel.countDocuments();

    const posts: PostDBType[] = await PostModel.find()
      .populate("blog")
      .populate("reactionInfo")
      // .populate({
      //   path: "reactionInfo",
      //   select: "myStatus",
      // })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .sort({ [query.sortBy]: query.sortDirection })
      .lean();

    const postsToView = {
      pagesCount: Math.ceil(totalPostsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalPostsCount,
      items: posts,
    };

    return postsToView;
  }

  async getByIdPost(id: string): Promise<PostDBType | null> {
    return await PostModel.findOne({
      _id: new ObjectId(id),
    })
      .populate("blog")
      .populate("reactionInfo")
      // .populate({
      //   path: "reactionInfo",
      //   select: "myStatus",
      // })
      // .populate({
      //   path: "reactionInfo.latestReactions.user",
      //   select: ["login", "_id"],
      // })
      .exec();
  }

  async getReactionStatus(userId: string, postId: string) {
    return PostReactionModel.findOne({ user: userId, post: postId });
  }

  async getPostReactions(postId: string): Promise<LikeDetailsDBType[] | null> {
    return await PostReactionModel.find({
      post: postId,
      myStatus: LikeStatus.Like,
    }).populate({
      path: "latestReactions.user",
      select: ["login", "_id"],
    });
  }
}
