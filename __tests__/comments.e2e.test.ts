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
    it("should get comment by id & return status code 200", async () => {
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

    it("shouldn't get comment if id is not found & return status code 404", async () => {
      const id = "55350138933a2fd38939a3e4";
      const comment = await commentManager.commentToView();
      const res = await request(app)
        .get(`${SETTINGS.PATH.COMMENTS}/${id}`)
        .send(comment)
        .expect(404);
    });
  });

  // describe("UPDATE COMMENT BY ID", () => {
  //  it("1- should create comment for proper post and with user auth & return status code 201", async () => {
  //    const user = await authManager.createUser();
  //    const loginUser = await authManager.loginUser();
  //    const token = await authManager.userToken();
  //    const postId = await postManager.getPostId();
  //    const comment = await postManager.createComment();
  //    const res = await request(app)
  //      .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
  //      .send(comment)
  //      .set("Authorization", `Bearer ${token}`)
  //      .expect(201);
  //  });

  //  it("2- shouldn't create comment for proper post and with user auth if incorrect values & return status code 400", async () => {
  //    const loginUser = await authManager.loginUser();
  //    const token = await authManager.userToken();
  //    const postId = await postManager.getPostId();
  //    const shortComment = {
  //      content: "How it works?",
  //    };
  //    const res = await request(app)
  //      .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
  //      .send(shortComment)
  //      .set("Authorization", `Bearer ${token}`)
  //      .expect(400);
  //  });

  //  it("3- shouldn't create comment for proper post if user unauthorized & return status code 401", async () => {
  //    const loginUser = await authManager.loginUser();
  //    const token = await authManager.userToken();
  //    const postId = await postManager.getPostId();
  //    const comment = await postManager.createComment();
  //    const res = await request(app)
  //      .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
  //      .send(comment)
  //      .set("Authorization", `Bearer ${token}+1`)
  //      .expect(401);
  //  });

  //  it("4- shouldn't create comment for proper post if postId is not exist & return status code 404", async () => {
  //    const loginUser = await authManager.loginUser();
  //    const token = await authManager.userToken();
  //    const wrongPostId = "6634e807bcf8ea51a3d4da61";
  //    const comment = await postManager.createComment();
  //    const res = await request(app)
  //      .post(`${SETTINGS.PATH.POSTS}/${wrongPostId}/comments`)
  //      .send(comment)
  //      .set("Authorization", `Bearer ${token}`)
  //      .expect(404);
  //  });
  // });

  // describe("DELETE COMMENT BY ID", () => {

  // });
});
