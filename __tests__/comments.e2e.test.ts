import request from "supertest";
import { SETTINGS } from "../src/settings";
import { app } from "../src/app";
import { ConnectMongoDB } from "../src/cloud_DB";
import { commentManager } from "../src/testManager";
import { dropCollections } from "../src/testManager/dropCollections";

describe("/comments test", () => {
  beforeAll(async () => {
    await ConnectMongoDB();
  });

  afterAll(async () => {
    //await dropCollections();
  });

  describe("GET COMMENT BY ID", () => {
    it("1 - should get comment by id & return status code 200", async () => {
      const createUser = await commentManager.createUser();
      const loggedUserToken = await commentManager.userToken();
      const blogId = await commentManager.createBlog();
      const postId = await commentManager.createPost(blogId);
      const newComment = await commentManager.createComment(
        loggedUserToken,
        postId
      );
      const id = await commentManager.getCommentId();
      const comment = await commentManager.commentToView();
      console.log(id);
      console.log(comment);
      const res = await request(app)
        .get(`${SETTINGS.PATH.COMMENTS}/${id}`)
        .send(comment)
        .expect(200);
    });

    it("2 - shouldn't get comment if id is not found & return status code 404", async () => {
      const id = "55350138933a2fd38939a3e4";
      const comment = await commentManager.commentToView();
      const res = await request(app)
        .get(`${SETTINGS.PATH.COMMENTS}/${id}`)
        .send(comment)
        .expect(404);
    });
  });

  describe("UPDATE COMMENT BY ID", () => {
    it("1- should update comment by id if user auth & return status code 204", async () => {
      const loggedUserToken = await commentManager.userToken();
      const commentId = await commentManager.getCommentId();
      const newComment = {
        content: "Still can't understand, need more info to get how it works?",
      };
      const res = await request(app)
        .put(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
        .send(newComment)
        .set("Authorization", `Bearer ${loggedUserToken}`)
        .expect(204);
    });

    it("2- shouldn't update comment by id if user auth and if incorrect values & return status code 400", async () => {
      const loggedUserToken = await commentManager.userToken();
      const commentId = await commentManager.getCommentId();
      const shortComment = {
        content: "How it works?",
      };
      const res = await request(app)
        .put(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
        .send(shortComment)
        .set("Authorization", `Bearer ${loggedUserToken}`)
        .expect(400);
    });

    it("3- shouldn't update comment by id if user unauthorized & return status code 401", async () => {
      const loggedUserToken = await commentManager.userToken();
      const commentId = await commentManager.getCommentId();
      const newComment = {
        content: "Still can't understand, need more info to get how it works?",
      };
      const res = await request(app)
        .put(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
        .send(newComment)
        .set("Authorization", `Bearer ${loggedUserToken}+1`)
        .expect(401);
    });

    it("4- shouldn't update comment by id if commentId is not exist & return status code 404", async () => {
      const loggedUserToken = await commentManager.userToken();
      const commentId = "6634e807bcf8ea51a3d4da61";
      const newComment = {
        content: "Still can't understand, need more info to get how it works?",
      };
      const res = await request(app)
        .put(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
        .send(newComment)
        .set("Authorization", `Bearer ${loggedUserToken}`)
        .expect(404);
    });

    it("shouldn't update comment if commentId !== user.id & return status code 403", async () => {
      //   const createUser = await commentManager.createUser();
      //    const loggedUserToken = await commentManager.userToken();
      //     const commentId = await commentManager.getCommentId();

      const user1creds = {
        login: "Tina",
        password: "tina123",
        email: "Tina@gmail.com",
      };
      const user2creds = {
        login: "Tina2",
        password: "tina123",
        email: "Tina2@gmail.com",
      };
      const user1 = await request(app)
        .post(SETTINGS.PATH.USERS)
        .send(user1creds)
        .auth("admin", "qwerty")
        .expect(201);

      const user2 = await request(app)
        .post(SETTINGS.PATH.USERS)
        .send(user2creds)
        .auth("admin", "qwerty")
        .expect(201);

      const user1tokens = await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send({
          loginOrEmail: user1creds.email,
          password: user1creds.password,
        })
        .expect(200);

      const user2tokens = await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send({
          loginOrEmail: user2creds.email,
          password: user2creds.password,
        })
        .expect(200);

      const newBlog = {
        name: "Promise",
        description: "do you know promise?",
        websiteUrl: "https://google.com",
      };

      const createdBlogResponse = await request(app)
        .post(SETTINGS.PATH.BLOGS)
        .send(newBlog)
        .auth("admin", "qwerty")
        .expect(201);

      const newPost = {
        title: "Refactor",
        shortDescription: "Learn more about refactor in " + new Date(),
        content: "whole content about refactor",
        blogId: createdBlogResponse.body.id,
      };

      const createdPostResponse = await request(app)
        .post(SETTINGS.PATH.POSTS)
        .send(newPost)
        .auth("admin", "qwerty")
        .expect(201);

      const newComment = {
        content: "Is there a better way to explain how it works?",
      };

      const createdCommentResponse = await request(app)
        .post(`${SETTINGS.PATH.POSTS}/${createdPostResponse.body.id}/comments`)
        .send(newComment)
        .set("Authorization", `Bearer ${user1tokens.body.accessToken}`)
        .expect(201);

      const changeCommentByOwnerResponse = await request(app)
        .put(`${SETTINGS.PATH.COMMENTS}/${createdCommentResponse.body.id}`)
        .send(newComment)
        .set("Authorization", `Bearer ${user1tokens.body.accessToken}`)
        .expect(204);

      const changeCommentByNotOwnerResponse = await request(app)
        .put(`${SETTINGS.PATH.COMMENTS}/${createdCommentResponse.body.id}`)
        .send(newComment)
        .set("Authorization", `Bearer ${user2tokens.body.accessToken}`)
        .expect(403);
    });

    // describe("DELETE COMMENT BY ID", () => {
  });
});
