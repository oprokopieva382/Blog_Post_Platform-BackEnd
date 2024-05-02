import request from "supertest";
import { SETTINGS } from "../settings";
import { app } from "../app";

export const postManager = {
  async createPost() {
    const newPost = {
      title: "Refactor",
      shortDescription: "Learn more about refactor in " + new Date(),
      content: "whole content about refactor",
      blogId: "662bf8758f1a93a2082eb4ee",
    };
    return newPost;
  },

  async updatePost() {
    const postToUpdate = {
      title: "Nest.js",
      shortDescription: "Learn more about Nest.js in " + new Date(),
      content: "whole content about Nest.js",
      blogId: "662bf8758f1a93a2082eb4ee",
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
};
