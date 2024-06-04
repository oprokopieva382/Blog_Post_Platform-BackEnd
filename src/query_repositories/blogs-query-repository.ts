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
      items: posts.map((p) => this._postDTO(p)),
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
      items: blogs.map((b) => this._blogDTO(b)),
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

    return this._blogDTO(foundBlog);
  },

  _blogDTO(blog: BlogDBType): BlogViewModel {
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

  _postDTO(post: PostDBType): PostViewModel {
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
