import { db } from "../db/db";
import { PostInputModel } from "../models/PostInputModel";

export const postsRepository = {
  getAllPosts() {
    const posts = db.posts;
    return posts;
  },

  getById(id: number) {
    const foundPost = db.posts.find(p=>p.id === id)
    return foundPost
  },

  createPost(data: PostInputModel) {
    const { title, shortDescription, content, blogId } = data;
    const newPost = {
      id: Math.floor(Date.now() + Math.random() * 1000000),
      title,
      shortDescription,
      content,
      blogId,
    };

    db.posts = [...db.posts, newPost];
    const createdPost = this.getById(newPost.id);
    return createdPost;
  },
};
