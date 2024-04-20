import { BlogDBType, PostDBType } from "../cloud_DB";
import { BlogViewModel, PostViewModel } from "../models";

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

const mapPostsToView = (post: PostDBType): PostViewModel => {
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

export { mapBlogDBToView, mapPostsToView };
