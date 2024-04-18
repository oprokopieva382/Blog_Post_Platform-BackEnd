import { ObjectId} from "mongodb";
import { postsCollection } from "../cloud_DB";
import { QueryType } from "../features/blogs";

export const blogsQueryRepository = {
  async getPostsOfBlog(
    blogId: string,
    searchQueryTitle: any,
    query: QueryType
  ) {
    return await postsCollection
      .find({ blogId: new ObjectId(blogId), ...searchQueryTitle })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .sort(query.sortBy, query.sortDirection)
      .toArray();
  },
};
