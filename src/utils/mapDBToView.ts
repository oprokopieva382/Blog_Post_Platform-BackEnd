import { BlogDBType, PostDBType, UserDBType } from "../cloud_DB";
import { BlogViewModel, PostViewModel, UserViewModel } from "../models";

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

const mapUserDBToView = (user: UserDBType): UserViewModel => {
  return {
    // Convert ObjectId to string
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
};

export { mapBlogDBToView, mapPostsToView, mapUserDBToView };
