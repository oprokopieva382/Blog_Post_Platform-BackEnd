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

    const res = await request(app)
      .post(SETTINGS.PATH.BLOGS)
      .send(newBlog)
      .auth("admin", "qwerty")
      .expect(201);

    return res.body.data;
  },

  async getBlogs() {
    const res = await request(app).get(SETTINGS.PATH.BLOGS).expect(200);
    return res.body.data.items;
  },



  async createPost(blogId: string) {
    const newPost = {
      title: "Memo",
      shortDescription: "Learn more about memo in " + new Date(),
      content: "whole content about memo",
    };

    await request(app)
      .post(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
      .send(newPost)
      .auth("admin", "qwerty")
      .expect(201);
  },
};
