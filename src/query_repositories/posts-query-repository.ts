import { ObjectId } from "mongodb";
import { PostDBType, postsCollection } from "../cloud_DB";
import { Paginator, PostViewModel } from "../models";
import { QueryType } from "../query-type";

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
      items: posts.map((p) => this._mapPostDBToView(p)),
    };

    return postsToView;
  },

  async getByIdPost(id: string): Promise<PostViewModel | null> {
    const foundPost = await postsCollection.findOne({ _id: new ObjectId(id) });
    return foundPost ? this._mapPostDBToView(foundPost) : null;
  },

  _mapPostDBToView(post: PostDBType): PostViewModel {
    return {
      // Convert ObjectId to string
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId.toString(),
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  },
};
