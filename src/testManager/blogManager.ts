import request from "supertest";
import { SETTINGS } from "../settings";
import { app } from "../app";

export const blogManager = {
  async createBlog() {
    const newBlog = {
      name: "Promise",
      description: "do you know promise?",
      websiteUrl: "https://google.com",
    };
    return newBlog;
  },

  async updateBlog() {
    const blogToUpdate = {
      title: "Nest.js",
      shortDescription: "Learn more about Nest.js in " + new Date(),
      content: "whole content about Nest.js",
      blogId: "662bf8758f1a93a2082eb4ee",
    };
    return blogToUpdate;
  },

  async blogsWithPagination(pageNumber: number = 1, pageSize: number = 10) {
    const blogs = await this.getBlogs();
    const totalBlogsCount = blogs.length;

    const paginatorBlogView = {
      pagesCount: Math.ceil(totalBlogsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: totalBlogsCount,
      items: blogs,
    };
    return paginatorBlogView;
  },

  async getBlogs() {
    const blogsRequest = await request(app)
      .get(SETTINGS.PATH.BLOGS)
      .auth("admin", "qwerty")
      .expect(200);
    const blogs = blogsRequest.body.items;

    return blogs;
  },

  async getBlogId() {
    const blogsRequest = await request(app)
      .get(SETTINGS.PATH.BLOGS)
      .auth("admin", "qwerty")
      .expect(200);
    const blogId = blogsRequest.body.items[1].id;

    return blogId;
  },
};
