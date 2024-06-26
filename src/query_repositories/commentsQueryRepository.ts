import { ObjectId } from "mongodb";
import { CommentViewModel, Paginator } from "../type-models";
import { CommentDBType } from "../cloud_DB/mongo_db_types";
import { QueryCommentsType } from "../query-type";
import { commentDTO } from "../DTO";
import { CommentModel } from "../models";

export const commentsQueryRepository = {
  async getCommentsOfPost(
    postId: string,
    query: QueryCommentsType
  ): Promise<Paginator<CommentViewModel>> {
    const totalCommentsCount = await CommentModel.countDocuments({
      postId: postId.toString(),
    });

    const comments: CommentDBType[] = await CommentModel.find({
      postId: postId.toString(),
    })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .sort({ [query.sortBy]: query.sortDirection })
      .lean();

    const commentsToView = {
      pagesCount: Math.ceil(totalCommentsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCommentsCount,
      items: comments.map((c) => commentDTO(c)),
    };

    return commentsToView;
  },

  async getByIdComment(id: string): Promise<CommentDBType | null> {
    return await CommentModel.findOne({
      _id: new ObjectId(id),
    });
  },
};
