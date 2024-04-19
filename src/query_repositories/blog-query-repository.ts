import { ObjectId } from "mongodb";
import { BlogDBType, blogsCollection, postsCollection } from "../cloud_DB";
import { QueryType } from "../features/blogs";
import { BlogViewModel, Paginator } from "../models";

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
      items: blogs.map((b) => this._mapBlogsToView(b)),
    };

    return blogsToView;
  },

  _mapBlogsToView(blog: BlogDBType): BlogViewModel {
    return {
      // Convert ObjectId to string
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: false,
    };
  },
};
