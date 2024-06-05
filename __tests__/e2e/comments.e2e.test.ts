import request from "supertest";
import { SETTINGS } from "../../src/settings";
import { app } from "../../src/app";
import { ConnectMongoDB } from "../../src/cloud_DB";
import { authManager, blogManager } from "../../src/testManager";
import { dropCollections } from "../../src/testManager/dropCollections";

describe("/comments test", () => {
  beforeAll(async () => {
    await ConnectMongoDB();
  });

  afterEach(async () => {
    await dropCollections();
  });

  describe("GET COMMENT BY ID", () => {
    it("1 - should get comment by id & return status code 200", async () => {
      await authManager.createUser();
      const { res, refreshToken } = await authManager.loginUser();
      const accessToken = res.body.data.accessToken;
      const blog = await blogManager.createBlog();
      const post = await blogManager.createPost(blog.id);
      const comment = await blogManager.createComment(post.id, accessToken);

      await request(app)
        .get(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
        .expect(200);
    });

    it("2 - shouldn't get comment if id is not found & return status code 404", async () => {
      await authManager.createUser();
      const { res, refreshToken } = await authManager.loginUser();
      const accessToken = res.body.data.accessToken;
      const blog = await blogManager.createBlog();
      const post = await blogManager.createPost(blog.id);
      await blogManager.createComment(post.id, accessToken);
      const id = "55350138933a2fd38939a3e4";

      await request(app).get(`${SETTINGS.PATH.COMMENTS}/${id}`).expect(404);
    });
  });

  describe("UPDATE COMMENT BY ID", () => {
    it("1- should update comment by id if user auth & return status code 204", async () => {
      await authManager.createUser();
      const { res, refreshToken } = await authManager.loginUser();
      const accessToken = res.body.data.accessToken;
      const blog = await blogManager.createBlog();
      const post = await blogManager.createPost(blog.id);
      const comment = await blogManager.createComment(post.id, accessToken);

      const newComment = {
        content: "Still can't understand, need more info to get how it works?",
      };
      await request(app)
        .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
        .send(newComment)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(204);
    });

    it("2- shouldn't update comment by id if user auth and if incorrect values & return status code 400", async () => {
      await authManager.createUser();
      const { res, refreshToken } = await authManager.loginUser();
      const accessToken = res.body.data.accessToken;
      const blog = await blogManager.createBlog();
      const post = await blogManager.createPost(blog.id);
      const comment = await blogManager.createComment(post.id, accessToken);

      const shortComment = {
        content: "How it works?",
      };

      await request(app)
        .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
        .send(shortComment)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(400);
    });

    it("3- shouldn't update comment by id if user unauthorized & return status code 401", async () => {
      await authManager.createUser();
      const { res, refreshToken } = await authManager.loginUser();
      const accessToken = res.body.data.accessToken;
      const blog = await blogManager.createBlog();
      const post = await blogManager.createPost(blog.id);
      const comment = await blogManager.createComment(post.id, accessToken);

      const newComment = {
        content: "Still can't understand, need more info to get how it works?",
      };

      await request(app)
        .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
        .send(newComment)
        .set("Authorization", `Bearer ${accessToken}+1`)
        .expect(401);
    });

    it("4- shouldn't update comment by id if commentId is not exist & return status code 404", async () => {
      await authManager.createUser();
      const { res, refreshToken } = await authManager.loginUser();
      const accessToken = res.body.data.accessToken;
      const blog = await blogManager.createBlog();
      const post = await blogManager.createPost(blog.id);
      await blogManager.createComment(post.id, accessToken);
      const commentId = "6634e807bcf8ea51a3d4da61";

      const newComment = {
        content: "Still can't understand, need more info to get how it works?",
      };

      await request(app)
        .put(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
        .send(newComment)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(404);
    });

    it("shouldn't update comment if commentId !== user.id & return status code 403", async () => {
      await authManager.createUser();
      const { res, refreshToken } = await authManager.loginUser();
      const accessToken = res.body.data.accessToken;
      const blog = await blogManager.createBlog();
      const post = await blogManager.createPost(blog.id);
      const comment = await blogManager.createComment(post.id, accessToken);

      const newComment = {
        content: "Still can't understand, need more info to get how it works?",
      };

      const user2creds = {
        login: "Tina2",
        password: "tina123",
        email: "Tina2@gmail.com",
      };

      const user2 = await request(app)
        .post(SETTINGS.PATH.USERS)
        .send(user2creds)
        .auth("admin", "qwerty")
        .expect(201);

      const user2tokens = await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send({
          loginOrEmail: user2creds.email,
          password: user2creds.password,
        })
        .expect(200);

      await request(app)
        .put(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
        .send(newComment)
        .set("Authorization", `Bearer ${user2tokens.body.accessToken}`)
        .expect(403);
    });

    // describe("DELETE COMMENT BY ID", () => {
  });
});
