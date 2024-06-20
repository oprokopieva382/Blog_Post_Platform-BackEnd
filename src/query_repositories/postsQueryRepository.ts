import { ObjectId } from "mongodb";
import { PostDBType, postsCollection } from "../cloud_DB";
import { Paginator, PostViewModel } from "../models";
import { QueryType } from "../query-type";
import { postDTO } from "../DTO";

export const postsQueryRepository = {
  async getAllPosts(query: QueryType): Promise<Paginator<PostViewModel>> {
    const totalPostsCount = await postsCollection.countDocuments();

    const posts: PostDBType[] = await postsCollection
      .find()
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .sort(query.sortBy, query.sortDirection)
      .toArray();

    const postsToView = {
      pagesCount: Math.ceil(totalPostsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalPostsCount,
      items: posts.map((p) => postDTO(p)),
    };

    return postsToView;
  },

  async getByIdPost(id: string): Promise<PostViewModel | null> {
    const foundPost = await postsCollection.findOne({ _id: new ObjectId(id) });
    return foundPost ? postDTO(foundPost) : null;
  },

};
