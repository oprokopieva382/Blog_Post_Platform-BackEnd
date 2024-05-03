import request from "supertest";
import { SETTINGS } from "../settings";
import { app } from "../app";
import { blogManager } from "./blogManager";
import { blogsCollection, commentsCollection } from "../cloud_DB";
import { CommentDBType } from "../cloud_DB/mongo_db_types";

export const postManager = {
  async createPost() {
    const blog = await blogsCollection.find({}).toArray();
    const newPost = {
      title: "Refactor",
      shortDescription: "Learn more about refactor in " + new Date(),
      content: "whole content about refactor",
      blogId: blog[0]._id.toString(),
    };
    return newPost;
  },

  async updatePost() {
    const blog = await blogsCollection.find({}).toArray();
    const postToUpdate = {
      title: "Nest.js",
      shortDescription: "Learn more about Nest.js in " + new Date(),
      content: "whole content about Nest.js",
      blogId: blog[0]._id.toString(),
    };
    return postToUpdate;
  },

  async postsWithPagination(pageNumber: number = 1, pageSize: number = 10) {
    const posts = await this.getPosts();
    const totalPostsCount = posts.length;

    const paginatorPostView = {
      pagesCount: Math.ceil(totalPostsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: totalPostsCount,
      items: posts,
    };
    return paginatorPostView;
  },

  async getPosts() {
    const postsRequest = await request(app)
      .get(SETTINGS.PATH.POSTS)
      .auth("admin", "qwerty")
      .expect(200);
    const posts = postsRequest.body.items;

    return posts;
  },

  async getPostId() {
    const postsRequest = await request(app)
      .get(SETTINGS.PATH.POSTS)
      .auth("admin", "qwerty")
      .expect(200);

    const postId = postsRequest.body.items[0].id;

    return postId;
  },

  async createComment() {
    const newComment = {
      content: "Can you, please, explain how it works?",
    };
    return newComment;
  },

  async createBlog() {
    const blog = await blogManager.createBlog();

    const res = await request(app)
      .post(SETTINGS.PATH.BLOGS)
      .send(blog)
      .auth("admin", "qwerty")
      .expect(201);
  },

  async commentsWithPagination(pageNumber: number = 1, pageSize: number = 10, postId:string ) {
   const comments = await commentsCollection.find({ postId }).toArray();
    const totalCommentsCount = comments.length;

    const paginatorPostView = {
      pagesCount: Math.ceil(totalCommentsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: totalCommentsCount,
      items: comments.map((p) => ({
        id: p._id.toString(),
        content: p.content,
        commentatorInfo: {
          userId: p.commentatorInfo.userId,
          userLogin: p.commentatorInfo.userLogin,
        },
        createdAt: p.createdAt,
      })),
    };
    return paginatorPostView;
  },
};
