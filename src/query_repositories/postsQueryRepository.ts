import { ObjectId } from "mongodb";
import { PostDBType } from "../cloud_DB";
import { Paginator, PostViewModel } from "../type-models";
import { QueryType } from "../types/query-type";
import { PostDTO } from "../DTO";
import { PostModel } from "../models";

export const postsQueryRepository = {
  async getAllPosts(query: QueryType): Promise<Paginator<PostViewModel>> {
    const totalPostsCount = await PostModel.countDocuments();

    const posts: PostDBType[] = await PostModel.find()
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .sort({ [query.sortBy]: query.sortDirection })
      .lean();

    const postsToView = {
      pagesCount: Math.ceil(totalPostsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalPostsCount,
      items: posts.map((p) => PostDTO.transform(p)),
    };

    return postsToView;
  },

  async getByIdPost(id: string): Promise<PostViewModel | null> {
    const foundPost = await PostModel.findOne({ _id: new ObjectId(id) });
    return foundPost ? PostDTO.transform(foundPost) : null;
  },
};
