import { ObjectId} from "mongodb";
import { postsCollection } from "../cloud_DB";

export const blogsQueryRepository = {
  async getPostsOfBlog(blogId: string, searchQueries: any, query: any) {
    return await postsCollection
      .find({ blogId: new ObjectId(blogId), ...searchQueries })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .toArray();
  },

  async countPosts(blogId: string, searchQueries: any) {
    return await postsCollection.countDocuments({
      blogId: new ObjectId(blogId),
      ...searchQueries,
    });
  },
};
