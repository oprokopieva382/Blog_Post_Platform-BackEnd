import { ObjectId } from "mongodb";
import {
  BlogDBType,
  PostDBType,
  blogsCollection,
  postsCollection,
} from "../cloud_DB";
import { BlogViewModel, Paginator, PostViewModel } from "../models";
import { QueryType } from "../query-type";
import { ApiError } from "../helper/api-errors";
import { blogDTO, postDTO } from "../DTO";

export const blogsQueryRepository = {
  async getPostsOfBlog(
    blogId: string,
    query: QueryType
  ): Promise<Paginator<PostViewModel>> {
    const totalPostsCount = await postsCollection.countDocuments({
      blogId: new ObjectId(blogId),
    });

    const posts: PostDBType[] = await postsCollection
      .find({ blogId: new ObjectId(blogId) })
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

  async getAllBlogs(query: QueryType): Promise<Paginator<BlogViewModel>> {
    const search = query.searchNameTerm
      ? { name: { $regex: query.searchNameTerm, $options: "i" } }
      : {};

    const totalBlogsCount = await blogsCollection.countDocuments({
      ...search,
    });

    const blogs: BlogDBType[] = await blogsCollection
      .find(search)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .sort(query.sortBy, query.sortDirection)
      .toArray();

    const blogsToView = {
      pagesCount: Math.ceil(totalBlogsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalBlogsCount,
      items: blogs.map((b) => blogDTO(b)),
    };

    return blogsToView;
  },

  async getByIdBlog(id: string): Promise<BlogViewModel> {
    const foundBlog = await blogsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!foundBlog) {
      throw ApiError.NotFoundError("Not found", ["No blog found"]);
    }

    return blogDTO(foundBlog);
  },
};
