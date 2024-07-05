import { ObjectId } from "mongodb";
import { CommentViewModel, Paginator } from "../type-models";
import { CommentDBType } from "../cloud_DB/mongo_db_types";
import { QueryCommentsType } from "../types/query-type";
import { CommentDTO } from "../DTO";
import { CommentModel, ReactionModel } from "../models";

export class CommentQueryRepository {
  async getCommentsOfPost(
    postId: string,
    query: QueryCommentsType,
    userId?: string
  ): Promise<Paginator<CommentViewModel>> {
    const totalCommentsCount = await CommentModel.countDocuments({
      post: postId.toString(),
    });

    const comments: CommentDBType[] = await CommentModel.find({
      post: postId.toString(),
    })
      .populate({
        path: "likesInfo.status",
        select: "myStatus",
      })
      .populate("post", "_id")
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .sort({ [query.sortBy]: query.sortDirection });

    const commentsToView = {
      pagesCount: Math.ceil(totalCommentsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCommentsCount,
      items: await Promise.all(
        comments.map((c) => CommentDTO.transform(c, userId))
      ),
    };

    return commentsToView;
  }

  async getByIdComment(id: string): Promise<CommentDBType | null> {
    const result = await CommentModel.findOne({
      _id: new ObjectId(id),
    })
      .populate({
        path: "likesInfo.status",
        select: "myStatus",
      })
      .populate("post", "_id");

    return result;
  }

  async getUserReactionStatus(userId: string, commentId: string) {
    return ReactionModel.findOne({ user: userId, comment: commentId });
  }
}
