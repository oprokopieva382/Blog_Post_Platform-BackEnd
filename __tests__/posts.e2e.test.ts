import request from "supertest";
import { SETTINGS } from "../src/settings";
import { app } from "../src/app";
import { ConnectMongoDB } from "../src/cloud_DB";
import { authManager, blogManager, postManager } from "./../src/testManager";
import { dropCollections } from "./../src/testManager/dropCollections";

describe("/posts test", () => {
  beforeAll(async () => {
    await ConnectMongoDB();
  });

  afterAll(async () => {
    ///await dropCollections();
  });

  describe("CREATE POST", () => {
    it("1 - should create post and return  status code of 201", async () => {
      const blog = await postManager.createBlog();
      const newPost = await postManager.createPost();

      const res = await request(app)
        .post(SETTINGS.PATH.POSTS)
        .send(newPost)
        .auth("admin", "qwerty")
        .expect(201);
    });

    it("2 - shouldn't create post and return  status code of 400", async () => {
      const blogId = await blogManager.getBlogId();
      const newPost = {
        title: "",
        shortDescription: "",
        content: "whole content about refactor",
        blogId: blogId,
      };

      const res = await request(app)
        .post(SETTINGS.PATH.POSTS)
        .send(newPost)
        .auth("admin", "qwerty")
        .expect(400);

      expect(res.body.errorsMessages.length).toBe(2);
    });

    it("3 - shouldn't create post if unauthorized and return  status code of 401", async () => {
      const newPost = await postManager.createPost();

      const res = await request(app)
        .post(SETTINGS.PATH.POSTS)
        .send(newPost)
        .auth("admin252", "qwerty5252")
        .expect(401);
    });
  });

  describe("GET POSTS", () => {
    it("1 - should get posts and return status code 200 and object with pagination", async () => {
      const posts = await postManager.postsWithPagination(1, 5);

      const res = await request(app)
        .get(SETTINGS.PATH.POSTS)
        .send(posts)
        .auth("admin", "qwerty")
        .expect(200);
      expect(posts.page).toBe(1);
      expect(posts.pageSize).toBe(5);
    });
  });

  describe("UPDATE POSTS", () => {
    it("1 - should update posts and return status code 204", async () => {
      const postId = await postManager.getPostId();
      const update = await postManager.updatePost();
      const res = await request(app)
        .put(`${SETTINGS.PATH.POSTS}/${postId}`)
        .send(update)
        .auth("admin", "qwerty")
        .expect(204);
    });

    it("2 - shouldn't update post and return  status code of 400", async () => {
      const blogId = await blogManager.getBlogId();
      const postId = await postManager.getPostId();
      const update = {
        title: "",
        shortDescription: "",
        content: "",
        blogId: blogId,
      };

      const res = await request(app)
        .put(`${SETTINGS.PATH.POSTS}/${postId}`)
        .send(update)
        .auth("admin", "qwerty")
        .expect(400);

      expect(res.body.errorsMessages.length).toBe(3);
    });

    it("3 - shouldn't update posts and return status code 401", async () => {
      const postId = await postManager.getPostId();
      const update = await postManager.updatePost();
      const res = await request(app)
        .put(`${SETTINGS.PATH.POSTS}/${postId}`)
        .send(update)
        .auth("admin00", "qwerty4")
        .expect(401);
    });

    it("4 - shouldn't update posts and return status code 404 if Id not found", async () => {
      const postId = "662bb47c5ea70648a79f7c10";
      const update = await postManager.updatePost();
      const res = await request(app)
        .put(`${SETTINGS.PATH.POSTS}/${postId}`)
        .send(update)
        .auth("admin", "qwerty")
        .expect(404);
    });
  });

  describe("CREATE COMMENT FOR POST", () => {
    it("1- should create comment for proper post and with user auth & return status code 201", async () => {
      const user = await authManager.createUser();
      const loginUser = await authManager.loginUser();
      const token = await authManager.userToken();
      const postId = await postManager.getPostId();
      const comment = await postManager.createComment();
      const res = await request(app)
        .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
        .send(comment)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);
    });
  });

  // describe("DELETE POSTS", () => {
  //   it("1 - shouldn't delete post and return status code 401 if unauthorized", async () => {
  //     const posts = await postManager.getPosts();

  //     const res = await request(app)
  //       .delete(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
  //       .auth("admin5662", "qwerty")
  //       .expect(401);
  //   });

  //   it("2 - shouldn't delete post and return status code 404 if id is not exist", async () => {
  //     const postsId = "662bb47c5ea70648a79f7c10";

  //     const res = await request(app)
  //       .delete(`${SETTINGS.PATH.POSTS}/${postsId}`)
  //       .auth("admin", "qwerty")
  //       .expect(404);
  //   });

  //   it("3 - should delete post and return status code 204", async () => {
  //     const posts = await postManager.getPosts();
  //     console.log(posts);

  //     const res = await request(app)
  //       .delete(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
  //       .auth("admin", "qwerty")
  //       .expect(204);
  //   });
  //});
});
