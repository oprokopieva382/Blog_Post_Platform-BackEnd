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

  // updatePost(data: PostInputModel, id: number) {
  //   const postToUpdateIndex = db.blogs.findIndex((p) => p.id === id);

  //   if (postToUpdateIndex === -1) {
  //     return null;
  //   }

  //   db.blogs[postToUpdateIndex] = { ...db.blogs[postToUpdateIndex], ...data };

  //   return db.blogs[postToUpdateIndex];
  // },
};
