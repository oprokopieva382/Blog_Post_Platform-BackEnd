import { ObjectId } from "mongodb";
import { BlogDBType, PostDBType } from "../cloud_DB";
import { BlogViewModel, Paginator, PostViewModel } from "../type-models";
import { QueryType } from "../query-type";
import { ApiError } from "../helper/api-errors";
import { blogDTO, postDTO } from "../DTO";
import { BlogModel, PostModel } from "../models";

export const blogsQueryRepository = {
  async getPostsOfBlog(
    blogId: string,
    query: QueryType
  ): Promise<Paginator<PostViewModel>> {
    const totalPostsCount = await PostModel.countDocuments({
      blogId: new ObjectId(blogId),
    });

    const posts: PostDBType[] = await PostModel.find({
      blogId: new ObjectId(blogId),
    })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .sort({ [query.sortBy]: query.sortDirection })
      .lean();

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

    const totalBlogsCount = await BlogModel.countDocuments({
      ...search,
    });

    const blogs: BlogDBType[] = await BlogModel.find(search)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .sort({ [query.sortBy]: query.sortDirection })
      .lean();

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
    const foundBlog = await BlogModel.findOne({
      _id: new ObjectId(id),
    });

    if (!foundBlog) {
      throw ApiError.NotFoundError("Not found", ["No blog found"]);
    }

    return blogDTO(foundBlog);
  },
};
