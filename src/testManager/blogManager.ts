import request from "supertest";
import { SETTINGS } from "../settings";
import { app } from "../app";
import { blogsCollection, postsCollection } from "../cloud_DB";
import { ObjectId } from "mongodb";
import { BlogViewModel } from "../models";

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
      name: "Promise",
      description: "do you know promise well?",
      websiteUrl: "https://google.com",
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
    const blogsRequest: BlogViewModel[] = await this.getBlogs();
    const blogId = blogsRequest[0].id;

    return blogId;
  },

  async getBlogById(blogId: string) {
    const blog = await blogsCollection.findOne({
      _id: new ObjectId(blogId),
    });

    const blogToView = {
      id: blog?._id.toString(),
      name: blog?.name,
      description: blog?.description,
      websiteUrl: blog?.websiteUrl,
      createdAt: blog?.createdAt,
      isMembership: blog?.isMembership,
    };

    return blogToView;
  },

  async blogPostsWithPagination(pageNumber: number = 1, pageSize: number = 10) {
    const blogId = await blogManager.getBlogId();

    const posts = await postsCollection
      .find({ blogId: new ObjectId(blogId) })
      .toArray();

    const totalBlogPostsCount = posts.length;

    const paginatorBlogView = {
      pagesCount: Math.ceil(totalBlogPostsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: totalBlogPostsCount,
      items: posts.map((p) => ({
        id: p._id,
        ...p,
      })),
    };
    return paginatorBlogView;
  },

  async createPost() {
    const newPost = {
      title: "Memo",
      shortDescription: "Learn more about memo in " + new Date(),
      content: "whole content about memo",
    };

    return newPost;
  },
};
