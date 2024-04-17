import { ObjectId, SortDirection } from "mongodb";
import { PostDBType, postsCollection } from "../cloud_DB";
import { Paginator, PostViewModel } from "../models";
import { QueryType } from "../features/blogs";

export const blogsQueryRepository = {
  async getPostsOfBlog(
    blogId: string,
    searchQueries: QueryType
  ): Promise<Paginator<PostViewModel> | null> {
    

    const query = queryToSearch(searchQueries);
    const search = query.searchNameTerm ? {title: {$regex: query.searchNameTerm, $options: "i"}} : {}

    console.log(blogId);
    console.log(query);
    //found posts related blogId
    const foundPosts = await postsCollection
      .find({ blogId: new ObjectId(blogId), ...search })
      .toArray();

    console.log(foundPosts);

    const totalPostsCount = await postsCollection.countDocuments({
      blogId: new ObjectId(blogId),
      ...search,
    });

    //prep posts for output as Data Transfer Object
    const postsToView = {
      pagesCount: Math.ceil(totalPostsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalPostsCount,
      items: foundPosts.map((post) => mapBlogPostsToView(post)),
    };
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

//set up search query with default values if needed
const queryToSearch = (search: QueryType) => {
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
