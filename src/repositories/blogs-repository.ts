import { db } from "../db/db";
import { BlogInputModel } from "../models/BlogInputModel";

export const blogsRepository = {
  getAllBlogs() {
    const blogs = db.blogs;
    return blogs;
  },

  getByIdBlog(id: number) {
    const foundBlog = db.blogs.find((b) => b.id === id);
    return foundBlog ? foundBlog : null;
  },

  createBlog(data: BlogInputModel) {
    const { name, description, websiteUrl } = data;
    const newBlog = {
      id: Math.floor(Date.now() + Math.random() * 1000000),
      name,
      description,
      websiteUrl,
    };

    db.blogs = [...db.blogs, newBlog];
    const createdBlog = this.getByIdBlog(newBlog.id);
    return createdBlog;
  },

  removeBlog(id: number) {
    const foundBlog = db.blogs.find((b) => b.id === id);
    if (!foundBlog) {
      return null;
    }

    const newBlogsData = db.blogs.filter((b) => b.id !== id);
    db.blogs = newBlogsData;
    return foundBlog;
  },

  updateBlog(data: BlogInputModel, id: number) {
    const blogToUpdateIndex = db.blogs.findIndex((b) => b.id === id);

    if (blogToUpdateIndex === -1) {
      return null;
    }

    db.blogs[blogToUpdateIndex] = { ...db.blogs[blogToUpdateIndex], ...data };

    return db.blogs[blogToUpdateIndex];
  },
};
