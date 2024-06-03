import { BlogDBType, PostDBType, UserDBType } from "../cloud_DB";
import { CommentDBType } from "../cloud_DB/mongo_db_types";
import {
  BlogViewModel,
  CommentViewModel,
  MeViewModel,
  PostViewModel,
  UserViewModel,
} from "../models";

const blogDTO = (blog: BlogDBType): BlogViewModel => {
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

const postDTO = (post: PostDBType): PostViewModel => {
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

const userDTO = (user: UserDBType): UserViewModel => {
  return {
    // Convert ObjectId to string
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
};

const commentDTO = (comment: CommentDBType): CommentViewModel => {
  return {
    // Convert ObjectId to string
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
  };
};

const authDTO = (me: UserViewModel): MeViewModel => {
  return {
    email: me.email,
    login: me.login,
    userId: me.id,
  };
};

export { blogDTO, postDTO, userDTO, commentDTO, authDTO };
