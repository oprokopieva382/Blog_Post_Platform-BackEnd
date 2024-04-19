import { Paginator, PostInputModel, PostViewModel } from "../models";
import { PostDBType, postsCollection } from "../cloud_DB";
import { blogsRepository, postsRepository } from "../repositories";
import { ObjectId, SortDirection } from "mongodb";
import { QueryType } from "../features/blogs";

export const postsService = {
  async getAllPosts(
    searchQueries: any
  ): Promise<Paginator<PostViewModel> | null> {
    const query = constructSearchQuery(searchQueries);
    const search = query.searchNameTerm
      ? { title: { $regex: query.searchNameTerm, $options: "i" } }
      : {};

    const posts: PostDBType[] = await postsRepository.getAllPosts(
      search,
      query
    );
    if (posts.length === 0) {
      return null;
    }

    const totalPostsCount = await postsCollection.countDocuments({...search});

    //prep posts for output as Data Transfer Object
    const postsToView = {
      pagesCount: Math.ceil(totalPostsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalPostsCount,
      items: posts.map(mapPostDBToView),
    };

    return postsToView;
  },

  async getByIdPost(id: string): Promise<PostViewModel | null> {
    const foundPost = await postsRepository.getByIdPost(id);
    return foundPost ? mapPostDBToView(foundPost) : null;
  },

  async removePost(id: string) {
    const foundPost = await postsRepository.removePost(id);
    return foundPost ? mapPostDBToView(foundPost) : null;
  },

  async createPost(data: PostInputModel) {
    const { title, shortDescription, content, blogId } = data;

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

    const createdPost = await postsRepository.createPost(newPost);
    const insertedId = createdPost.insertedId;

    const createdPostExist = this.getByIdPost(insertedId.toString());
    return createdPostExist;
  },

  async updatePost(data: PostInputModel, id: string) {
    const isBlogExist = await blogsRepository.getByIdBlog(data.blogId);

    if (!isBlogExist) {
      return null;
    }
    await postsRepository.updatePost(data, id, isBlogExist.name);

    const updatedPost = await postsRepository.getByIdPost(id);
    return updatedPost;
  },
};

const mapPostDBToView = (post: PostDBType): PostViewModel => {
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
