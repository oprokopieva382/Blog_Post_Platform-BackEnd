import { ObjectId, SortDirection } from "mongodb";
import { PostDBType, postsCollection } from "../cloud_DB";
import { Paginator, PostViewModel } from "../models";
import { QueryType } from "../features/blogs";

export const blogsQueryRepository = {
  async getPostsOfBlog(
    blogId: string,
    searchQueries: QueryType
  ): Promise<Paginator<PostViewModel> | null> {
    //set up search query with default values if needed
    const query = {
      pageNumber: searchQueries.pageNumber ? +searchQueries.pageNumber : 1,
      pageSize:
        searchQueries.pageSize !== undefined ? +searchQueries.pageSize : 10,
      sortBy: searchQueries.sortBy ? searchQueries.sortBy : "createdAt",
      sortDirection: searchQueries.sortDirection
        ? (searchQueries.sortDirection as SortDirection)
        : "desc",
      searchNameTerm: searchQueries.searchNameTerm
        ? searchQueries.searchNameTerm
        : null,
    };

    //found posts related blogId
    const foundPosts = await postsCollection
      .find({ _id: new ObjectId(blogId), ...query })
      .toArray();

    const totalPostsCount = await postsCollection.countDocuments({
      _id: new ObjectId(blogId),
      ...query,
    });

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
