import request from "supertest";
import { SETTINGS } from "../../src/settings";
import { app } from "../../src/app";
import { ConnectMongoDB } from "../../src/cloud_DB";
import { authManager, blogManager } from "../../src/testManager";
import { dropCollections } from "../../src/testManager/dropCollections";

describe("/posts test", () => {
  beforeAll(async () => {
    await ConnectMongoDB();
  });

  afterEach(async () => {
    await dropCollections();
  });

  describe("CREATE POST", () => {
    it("1 - should create post and return  status code of 201", async () => {
      await authManager.createUser();
      const blog = await blogManager.createBlog();

      const newPost = {
        title: "Refactor",
        shortDescription: "Learn more about refactor in " + new Date(),
        content: "whole content about refactor",
        blogId: blog.id,
      };

      await request(app)
        .post(SETTINGS.PATH.POSTS)
        .send(newPost)
        .auth("admin", "qwerty")
        .expect(201);
    });

    it("2 - shouldn't create post and return  status code of 400", async () => {
      await authManager.createUser();
      const blog = await blogManager.createBlog();

      const newPost = {
        title: "",
        shortDescription: "",
        content: "whole content about refactor",
        blogId: blog.id,
      };

      const res = await request(app)
        .post(SETTINGS.PATH.POSTS)
        .send(newPost)
        .auth("admin", "qwerty")
        .expect(400);

      expect(res.body.errorsMessages.length).toBe(2);
    });

    it("3 - shouldn't create post if unauthorized and return  status code of 401", async () => {
      await authManager.createUser();
      const blog = await blogManager.createBlog();

      const newPost = {
        title: "Refactor",
        shortDescription: "Learn more about refactor in " + new Date(),
        content: "whole content about refactor",
        blogId: blog.id,
      };

      await request(app)
        .post(SETTINGS.PATH.POSTS)
        .send(newPost)
        .auth("admin252", "qwerty5252")
        .expect(401);
    });
  });

  describe("GET POSTS", () => {
    it("1 - should get posts and return status code 200 and object with pagination", async () => {
      await authManager.createUser();
      const blog = await blogManager.createBlog();
      await blogManager.createPost(blog.id);

      const res = await request(app)
        .get(`${SETTINGS.PATH.POSTS}?pageNumber=1&pageSize=5`)
        .auth("admin", "qwerty")
        .expect(200);
      expect(res.body.data.page).toBe(1);
      expect(res.body.data.pageSize).toBe(5);
    });
  });

  describe("UPDATE POSTS", () => {
    it("1 - should update posts and return status code 204", async () => {
      await authManager.createUser();
      const blog = await blogManager.createBlog();
      const post = await blogManager.createPost(blog.id);

      const update = {
        title: "Nest.js",
        shortDescription: "Learn more about Nest.js in " + new Date(),
        content: "whole content about Nest.js",
        blogId: blog.id,
      };

      await request(app)
        .put(`${SETTINGS.PATH.POSTS}/${post.id}`)
        .send(update)
        .auth("admin", "qwerty")
        .expect(204);
    });

    it("2 - shouldn't update post and return  status code of 400", async () => {
      await authManager.createUser();
      const blog = await blogManager.createBlog();
      const post = await blogManager.createPost(blog.id);

      const update = {
        title: "",
        shortDescription: "",
        content: "",
        blogId: blog.id,
      };

      const res = await request(app)
        .put(`${SETTINGS.PATH.POSTS}/${post.id}`)
        .send(update)
        .auth("admin", "qwerty")
        .expect(400);

      expect(res.body.errorsMessages.length).toBe(3);
    });

    it("3 - shouldn't update posts and return status code 401", async () => {
      await authManager.createUser();
      const blog = await blogManager.createBlog();
      const post = await blogManager.createPost(blog.id);

      const update = {
        title: "Nest.js",
        shortDescription: "Learn more about Nest.js in " + new Date(),
        content: "whole content about Nest.js",
        blogId: blog.id,
      };

      await request(app)
        .put(`${SETTINGS.PATH.POSTS}/${post.id}`)
        .send(update)
        .auth("admin00", "qwerty4")
        .expect(401);
    });

    it("4 - shouldn't update posts and return status code 404 if Id not found", async () => {
      await authManager.createUser();
      const blog = await blogManager.createBlog();
      await blogManager.createPost(blog.id);

      const update = {
        title: "Nest.js",
        shortDescription: "Learn more about Nest.js in " + new Date(),
        content: "whole content about Nest.js",
        blogId: blog.id,
      };

      const postId = "662bb47c5ea70648a79f7c10";

      await request(app)
        .put(`${SETTINGS.PATH.POSTS}/${postId}`)
        .send(update)
        .auth("admin", "qwerty")
        .expect(404);
    });
  });

  describe("CREATE COMMENT FOR POST", () => {
    it("1- should create comment for proper post and with user auth & return status code 201", async () => {
      await authManager.createUser();
      const { res, refreshToken } = await authManager.loginUser();
      const accessToken = res.body.data.accessToken;
      const blog = await blogManager.createBlog();
      const post = await blogManager.createPost(blog.id);

      const comment = {
        content: "Can you, please, explain how it works?",
      };

      await request(app)
        .post(`${SETTINGS.PATH.POSTS}/${post.id}/comments`)
        .send(comment)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(201);
    });

    it("2- shouldn't create comment for proper post and with user auth if incorrect values & return status code 400", async () => {
      await authManager.createUser();
      const { res, refreshToken } = await authManager.loginUser();
      const accessToken = res.body.data.accessToken;
      const blog = await blogManager.createBlog();
      const post = await blogManager.createPost(blog.id);

      const shortComment = {
        content: "How it works?",
      };

      await request(app)
        .post(`${SETTINGS.PATH.POSTS}/${post.id}/comments`)
        .send(shortComment)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(400);
    });

    it("3- shouldn't create comment for proper post if user unauthorized & return status code 401", async () => {
      await authManager.createUser();
      const { res, refreshToken } = await authManager.loginUser();
      const accessToken = res.body.data.accessToken;
      const blog = await blogManager.createBlog();
      const post = await blogManager.createPost(blog.id);

      const comment = {
        content: "Can you, please, explain how it works?",
      };

      await request(app)
        .post(`${SETTINGS.PATH.POSTS}/${post.id}/comments`)
        .send(comment)
        .set("Authorization", `Bearer ${accessToken}+1`)
        .expect(401);
    });

    it("4- shouldn't create comment for proper post if postId is not exist & return status code 404", async () => {
      await authManager.createUser();
      const { res, refreshToken } = await authManager.loginUser();
      const accessToken = res.body.data.accessToken;
      const blog = await blogManager.createBlog();
      await blogManager.createPost(blog.id);
      const wrongPostId = "6634e807bcf8ea51a3d4da61";

      const comment = {
        content: "Can you, please, explain how it works?",
      };

      await request(app)
        .post(`${SETTINGS.PATH.POSTS}/${wrongPostId}/comments`)
        .send(comment)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe("GET COMMENTS OF POST", () => {
    it("1 - shouldn't find comment for proper post if postId is not exist & return status code 404", async () => {
      await authManager.createUser();
      const { res, refreshToken } = await authManager.loginUser();
      const accessToken = res.body.data.accessToken;
      const blog = await blogManager.createBlog();
      const post = await blogManager.createPost(blog.id);
      await blogManager.createComment(post.id, accessToken);

      await blogManager.createPost(blog.id);
      const wrongPostId = "6634e807bcf8ea51a3d4da61";

      await request(app)
        .get(
          `${SETTINGS.PATH.POSTS}/${wrongPostId}/comments?pageNumber=1&pageSize=5`
        )
        .expect(404);
    });

    it("2 - should find comment for proper post if postId exist, return status code 200 & object with pagination", async () => {
      await authManager.createUser();
      const { res, refreshToken } = await authManager.loginUser();
      const accessToken = res.body.data.accessToken;
      const blog = await blogManager.createBlog();
      const post = await blogManager.createPost(blog.id);
      await blogManager.createComment(post.id, accessToken);

      await request(app)
        .get(
          `${SETTINGS.PATH.POSTS}/${post.id}/comments?pageNumber=1&pageSize=5`
        )
        .expect(200);
    });
  });

  describe("DELETE POST", () => {
    it("1 - shouldn't delete post and return status code 401 if unauthorized", async () => {
      await authManager.createUser();
      const blog = await blogManager.createBlog();
      const post = await blogManager.createPost(blog.id);

      await request(app)
        .delete(`${SETTINGS.PATH.POSTS}/${post.id}`)
        .auth("admin5662", "qwerty")
        .expect(401);
    });

    it("2 - shouldn't delete post and return status code 404 if id is not exist", async () => {
      await authManager.createUser();
      const blog = await blogManager.createBlog();
      await blogManager.createPost(blog.id);
      const postsId = "662bb47c5ea70648a79f7c10";

      await request(app)
        .delete(`${SETTINGS.PATH.POSTS}/${postsId}`)
        .auth("admin", "qwerty")
        .expect(404);
    });

    it("3 - should delete post and return status code 204", async () => {
      await authManager.createUser();
      const blog = await blogManager.createBlog();
      const post = await blogManager.createPost(blog.id);

      await request(app)
        .delete(`${SETTINGS.PATH.POSTS}/${post.id}`)
        .auth("admin", "qwerty")
        .expect(204);
    });
  });
});
