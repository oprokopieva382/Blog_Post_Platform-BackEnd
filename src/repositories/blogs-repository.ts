import { db } from "../db/db";

export const blogsRepository = {
  getAllBlogs() {
    const blogs = db.blogs;
    return blogs;
  },

  // getByIdPost(id: number) {
  //   const foundPost = db.blogs.find((p) => p.id === id);
  //   return foundPost ? foundPost : null;
  // },

  // createPost(data: PostInputModel) {
  //   const { title, shortDescription, content, blogId } = data;
  //   const newPost = {
  //     id: Math.floor(Date.now() + Math.random() * 1000000),
  //     title,
  //     shortDescription,
  //     content,
  //     blogId,
  //     blogName: "blogNameCommingSoon",
  //   };

  //   db.blogs = [...db.blogs, newPost];
  //   const createdPost = this.getByIdPost(newPost.id);
  //   return createdPost;
  // },

  // removePost(id: number) {
  //   const foundPost = db.blogs.find((p) => p.id === id);
  //   if (!foundPost) {
  //     return null;
  //   }

  //   const newPostData = db.blogs.filter((p) => p.id !== id);
  //   db.blogs = newPostData;
  //   return foundPost;
  // },

  // updatePost(data: PostInputModel, id: number) {
  //   const postToUpdateIndex = db.blogs.findIndex((p) => p.id === id);

  //   if (postToUpdateIndex === -1) {
  //     return null;
  //   }

  //   db.blogs[postToUpdateIndex] = { ...db.blogs[postToUpdateIndex], ...data };

  //   return db.blogs[postToUpdateIndex];
  // },
};
