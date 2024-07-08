import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { CommentDBType } from "../cloud_DB/mongo_db_types";
import { QueryCommentsType } from "../types/query-type";

import { CommentModel, CommentReactionModel } from "../models";

@injectable()
export class CommentQueryRepository {
  async getCommentsOfPost(
    postId: string,
    query: QueryCommentsType,
    ) {
    const totalCommentsCount = await CommentModel.countDocuments({
      post: postId.toString(),
    });

    const comments: CommentDBType[] = await CommentModel.find({
      post: postId.toString(),
    })
      .populate("post", "_id")
      .populate({
        path: "status",
        select: "myStatus",
      })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .sort({ [query.sortBy]: query.sortDirection });

    const commentsToView = {
      pagesCount: Math.ceil(totalCommentsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCommentsCount,
      items: comments
    };

    return commentsToView;
  }

  async getByIdComment(id: string): Promise<CommentDBType | null> {
    return await CommentModel.findOne({
      _id: new ObjectId(id),
    })
      .populate({
        path: "status",
        select: "myStatus",
      })
      .populate("post", "_id");
  }

  async getReactionStatus(userId: string, commentId: string) {
    return CommentReactionModel.findOne({ user: userId, comment: commentId });
  }
}
