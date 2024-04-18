import { ObjectId, SortDirection } from "mongodb";
import { BlogDBType, PostDBType, blogsCollection } from "../cloud_DB";
import {
  BlogInputModel,
  BlogPostInputModel,
  BlogViewModel,
  Paginator,
  PostViewModel,
} from "../models";
import { blogsRepository, postsRepository } from "../repositories";
import { QueryType } from "../features/blogs";
import { blogsQueryRepository } from "../query_repositories";

export const blogsService = {
  async getAllBlogs(
    searchQueries: QueryType
  ): Promise<Paginator<BlogViewModel> | null> {
    const query = constructSearchQuery(searchQueries);
    const search = query.searchNameTerm
      ? { name: { $regex: query.searchNameTerm, $options: "i" } }
      : {};

    const blogs = await blogsRepository.getAllBlogs(search, query);
    if (blogs.length === 0) {
      return null;
    }

    const totalBlogsCount = await blogsCollection.countDocuments({});

    //prep blogs for output as Data Transfer Object
    const blogsToView = {
      pagesCount: Math.ceil(totalBlogsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalBlogsCount,
      items: blogs.map(mapBlogDBToView),
    };

    return blogsToView;
  },

  async getByIdBlog(id: string): Promise<BlogViewModel | null> {
    const foundBlog = await blogsRepository.getByIdBlog(id);
    return foundBlog ? mapBlogDBToView(foundBlog) : null;
  },

  async removeBlog(id: string) {
    const blogToDelete = await blogsRepository.removeBlog(id);
    return blogToDelete ? mapBlogDBToView(blogToDelete) : null;
  },

  async createBlog(data: BlogInputModel) {
    const newBlog = {
      _id: new ObjectId(),
      createdAt: new Date().toISOString(),
      ...data,
    };
    const createdBlog = await blogsRepository.createBlog(newBlog);
    const insertedId = createdBlog.insertedId;

    const createdBlogExist = this.getByIdBlog(insertedId.toString());
    return createdBlogExist;
  },

  async updateBlog(data: BlogInputModel, id: string) {
    const updatedBlog = await blogsRepository.updateBlog(data, id);
    return updatedBlog;
  },

  async getPostsOfBlog(
    blogId: string,
    searchQueries: QueryType
  ): Promise<Paginator<PostViewModel> | null> {
    const query = constructSearchQuery(searchQueries);
    const search = query.searchNameTerm
      ? { title: { $regex: query.searchNameTerm, $options: "i" } }
      : {};

    const foundPosts = await blogsQueryRepository.getPostsOfBlog(
      blogId,
      search,
      query
    );
    if (foundPosts.length === 0) {
      return null;
    }

    const totalPostsCount = await blogsQueryRepository.countPosts(
      blogId,
      search
    );

    //prep posts for output as Data Transfer Object
    const postsToView = {
      pagesCount: Math.ceil(totalPostsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalPostsCount,
      items: foundPosts.map((post) => mapBlogPostsToView(post)),
    };
    console.log(postsToView);
    return postsToView;
  },

  async createPost(
    blogId: string,
    data: BlogPostInputModel
  ): Promise<PostViewModel | null> {
    const { title, shortDescription, content } = data;

    const isBlogExist = await blogsRepository.getByIdBlog(blogId);
    if (!isBlogExist) {
      return null;
    }

    const newPost = {
      _id: new ObjectId(),
      title,
      shortDescription,
      content,
      blogId: new ObjectId(blogId),
      blogName: isBlogExist.name,
      createdAt: new Date().toISOString(),
    };

    const createdPost = await blogsRepository.createPost(newPost);
    if (createdPost) {
      const insertedId = createdPost.insertedId;
      const createdPostExist = await postsRepository.getByIdPost(
        insertedId.toString()
      );
      return createdPostExist ? mapBlogPostsToView(createdPostExist) : null;
    }
    return null;
  },
};

const mapBlogDBToView = (blog: BlogDBType): BlogViewModel => {
  return {
    // Convert ObjectId to string
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: false,
  };
};

//set up search query with default values if needed
const constructSearchQuery = (search: QueryType) => {
  return {
    pageNumber: search.pageNumber ? +search.pageNumber : 1,
    pageSize: search.pageSize !== undefined ? +search.pageSize : 10,
    sortBy: search.sortBy ? search.sortBy : "createdAt",
    sortDirection: search.sortDirection
      ? (search.sortDirection as SortDirection)
      : "desc",
    searchNameTerm: search.searchNameTerm ? search.searchNameTerm : null,
  };
};

//help function to convert DBType to ViewType
const mapBlogPostsToView = (post: PostDBType): PostViewModel => {
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
};
