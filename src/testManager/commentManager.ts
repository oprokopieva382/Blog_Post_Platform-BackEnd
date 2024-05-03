import request from "supertest";
import { app } from "../app";
import { SETTINGS } from "../settings";
import { commentsCollection } from "../cloud_DB";
import { ObjectId } from "mongodb";
import { mapCommentDBToView } from "../utils/mapDBToView";

export const commentManager = {
  async createUser() {
    const newUser = {
      login: "Tina",
      password: "tina123",
      email: "Tina@gmail.com",
    };

    const res = await request(app)
      .post(SETTINGS.PATH.USERS)
      .send(newUser)
      .auth("admin", "qwerty")
      .expect(201);

    return newUser;
  },

  async userToken() {
    const loginInput = {
      loginOrEmail: "Tina@gmail.com",
      password: "tina123",
    };
    const res = await request(app)
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .send(loginInput)
      .expect(200);

    return res.body.accessToken;
  },

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

    return res.body.id;
  },

  async createPost(blogId: string) {
    const newPost = {
      title: "Refactor",
      shortDescription: "Learn more about refactor in " + new Date(),
      content: "whole content about refactor",
      blogId: blogId,
    };

    const res = await request(app)
      .post(SETTINGS.PATH.POSTS)
      .send(newPost)
      .auth("admin", "qwerty")
      .expect(201);

    return res.body.id;
  },

  async createComment(token: string, postId: string) {
    const newComment = {
      content: "Is there a better way to explain how it works?",
    };

    const res = await request(app)
      .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
      .send(newComment)
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    return newComment;
  },

  async getCommentId() {
    const foundComment = await commentsCollection.find({}).toArray();
    console.log(foundComment);
    return foundComment[0]._id.toString();
  },

  async commentToView() {
    const foundComment = await commentsCollection.find({}).toArray();
    const mappedComment = mapCommentDBToView(foundComment[0]);
    return mappedComment;
  },
};
