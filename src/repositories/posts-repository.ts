import { db } from "../db/db";
import { PostInputModel } from "../models/PostInputModel";

export const postsRepository = {
  getAllPosts() {
    const posts = db.posts;
    return posts;
  },

  getByIdPost(id: number) {
    const foundPost = db.posts.find((p) => p.id === id);
    return foundPost ? foundPost : null;
  },

  createPost(data: PostInputModel) {
    const { title, shortDescription, content, blogId } = data;
    const newPost = {
      id: Math.floor(Date.now() + Math.random() * 1000000),
      title,
      shortDescription,
      content,
      blogId,
      blogName: "blogNameCommingSoon",
    };

    db.posts = [...db.posts, newPost];
    const createdPost = this.getByIdPost(newPost.id);
    return createdPost;
  },

  removePost(id: number) {
    const newPostData = db.posts.filter((p) => p.id !== id);
    db.posts = newPostData;
  },
};
