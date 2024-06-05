import request from "supertest";
import { app } from "../../src/app";
import { SETTINGS } from "../../src/settings";
import { ConnectMongoDB } from "../../src/cloud_DB";
import { testManager } from "./test-helpers";
import { dropCollections } from "../e2e/dropCollections";

describe("/blogs test", () => {
  beforeAll(async () => {
    await ConnectMongoDB();
  });

  afterEach(async () => {
    await dropCollections();
  });

  describe("CREATE BLOG", () => {
    it("1 - should create blog and return  status code of 201", async () => {
      await testManager.createUser();
      const newBlog = {
        name: "Promise",
        description: "do you know promise?",
        websiteUrl: "https://google.com",
      };

      await request(app)
        .post(SETTINGS.PATH.BLOGS)
        .send(newBlog)
        .auth("admin", "qwerty")
        .expect(201);
    });

    it("2 - shouldn't create blog and return  status code of 400", async () => {
      await testManager.createUser();
      const newBlog = {
        name: "",
        description: "",
        websiteUrl: "",
      };

      const res = await request(app)
        .post(SETTINGS.PATH.BLOGS)
        .send(newBlog)
        .auth("admin", "qwerty")
        .expect(400);

      expect(res.body.errorsMessages.length).toBe(3);
    });

    it("3 - shouldn't create blog if unauthorized and return  status code of 401", async () => {
      await testManager.createUser();
      const newBlog = {
        name: "Promise",
        description: "do you know promise?",
        websiteUrl: "https://google.com",
      };

      await request(app)
        .post(SETTINGS.PATH.BLOGS)
        .send(newBlog)
        .auth("admin252", "qwerty5252")
        .expect(401);
    });
  });

  describe("GET BLOGS", () => {
    it("1 - should get blogs and return status code 200 and object with pagination", async () => {
      await testManager.createUser();
      await testManager.createBlog();

      const res = await request(app)
        .get(`${SETTINGS.PATH.BLOGS}?pageNumber=1&pageSize=5`)
        .expect(200);
      expect(res.body.data.page).toBe(1);
      expect(res.body.data.pageSize).toBe(5);
    });
  });

  describe("GET BLOG BY ID", () => {
    it("1 - should get blog by ID and return status code 200 and object", async () => {
      await testManager.createUser();
      const blog = await testManager.createBlog();

      await request(app).get(`${SETTINGS.PATH.BLOGS}/${blog.id}`).expect(200);
    });

    it("2 - shouldn't get blog by ID and return status 404 if blogId is not exist", async () => {
      await testManager.createUser();
      const blogId = "662bb47c5ea70648a79f7c10";

      await request(app).get(`${SETTINGS.PATH.BLOGS}/${blogId}`).expect(404);
    });
  });

  describe("UPDATE BLOG", () => {
    it("1 - should update blog and return status code 204", async () => {
      await testManager.createUser();
      const blog = await testManager.createBlog();

      const blogToUpdate = {
        name: "Promise",
        description: "do you know promise well?",
        websiteUrl: "https://google.com",
      };

      await request(app)
        .put(`${SETTINGS.PATH.BLOGS}/${blog.id}`)
        .send(blogToUpdate)
        .auth("admin", "qwerty")
        .expect(204);
    });

    it("2 - shouldn't update blog and return  status code of 400", async () => {
      await testManager.createUser();
      const blog = await testManager.createBlog();
      const update = {
        name: "Promise",
        description: "do you know promise well?",
        websiteUrl: "",
      };

      const res = await request(app)
        .put(`${SETTINGS.PATH.BLOGS}/${blog.id}`)
        .send(update)
        .auth("admin", "qwerty")
        .expect(400);
      expect(res.body.errorsMessages.length).toBe(1);
    });

    it("3 - shouldn't update blog and return status code 401 if unauthorized", async () => {
      await testManager.createUser();
      const blog = await testManager.createBlog();

      const update = {
        name: "Promise",
        description: "do you know promise well?",
        websiteUrl: "",
      };

      await request(app)
        .put(`${SETTINGS.PATH.BLOGS}/${blog.id}`)
        .send(update)
        .auth("admin00", "qwerty4")
        .expect(401);
    });

    it("4 - shouldn't update blog and return status code 404 if Id not found", async () => {
      await testManager.createUser();
      await testManager.createBlog();
      const blogId = "665de0b0ed6b88ba049eae66";

      const update = {
        name: "Promise",
        description: "do you know promise well?",
        websiteUrl: "https://google.com",
      };

      await request(app)
        .put(`${SETTINGS.PATH.BLOGS}/${blogId}`)
        .send(update)
        .auth("admin", "qwerty")
        .expect(404);
    });
  });

  describe("CREATE BLOG POST", () => {
    it("1 - should create blog post and return object with status 201", async () => {
      await testManager.createUser();
      const blog = await testManager.createBlog();

      const newPost = {
        title: "Memo",
        shortDescription: "Learn more about memo in " + new Date(),
        content: "whole content about memo",
      };

      await request(app)
        .post(`${SETTINGS.PATH.BLOGS}/${blog.id}/posts`)
        .send(newPost)
        .auth("admin", "qwerty")
        .expect(201);
    });

    it("2 - shouldn't create blog post and return status 404 if blogId is not exist", async () => {
      const blogId = "662bb47c5ea70648a79f7c10";

      const newPost = {
        title: "Memo",
        shortDescription: "Learn more about memo in " + new Date(),
        content: "whole content about memo",
      };

      await request(app)
        .post(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
        .send(newPost)
        .auth("admin", "qwerty")
        .expect(404);
    });

    it("3 - shouldn't create blog post and return object with status 400 if incorrect input values ", async () => {
      await testManager.createUser();
      const blog = await testManager.createBlog();
      const newPost = {
        title: "Promise",
        shortDescription: "do you know promise well?",
        content: "",
      };

      const res = await request(app)
        .post(`${SETTINGS.PATH.BLOGS}/${blog.id}/posts`)
        .send(newPost)
        .auth("admin", "qwerty")
        .expect(400);

      expect(res.body.errorsMessages.length).toBe(1);
    });

    it("4 - shouldn't create blog post and return object with status 401 if unauthorized ", async () => {
      await testManager.createUser();
      const blog = await testManager.createBlog();

      const newPost = {
        title: "Memo",
        shortDescription: "Learn more about memo in " + new Date(),
        content: "whole content about memo",
      };

      await request(app)
        .post(`${SETTINGS.PATH.BLOGS}/${blog.id}/posts`)
        .send(newPost)
        .auth("admin55", "qwertycc")
        .expect(401);
    });

    it("5 - shouldn't create blog post and return status 404 if blogId is not exist", async () => {
      await testManager.createUser();
      await testManager.createBlog();
      const blogId = "662bb47c5ea70648a79f7c10";

      const newPost = {
        title: "Memo",
        shortDescription: "Learn more about memo in " + new Date(),
        content: "whole content about memo",
      };

      await request(app)
        .post(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
        .send(newPost)
        .auth("admin", "qwerty")
        .expect(404);
    });
  });

  describe("GET BLOG POSTS", () => {
    it("1 - should get blog posts and return object with pagination & status 200", async () => {
      await testManager.createUser();
      const blog = await testManager.createBlog();
      await testManager.createPost(blog.id);

      await request(app)
        .get(`${SETTINGS.PATH.BLOGS}/${blog.id}/posts`)
        .auth("admin", "qwerty")
        .expect(200);
    });

    it("2 - shouldn't get blog posts and return status 404 if blogId is not exist", async () => {
      await testManager.createUser();
      const blog = await testManager.createBlog();
      await testManager.createPost(blog.id);
      const blogId = "662bb47c5ea70648a79f7c10";

      await request(app)
        .get(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
        .auth("admin", "qwerty")
        .expect(404);
    });
  });

  describe("DELETE BLOG", () => {
    it("1 - shouldn't delete blog and return status code 401 if unauthorized", async () => {
      await testManager.createUser();
      const blog = await testManager.createBlog();

      await request(app)
        .delete(`${SETTINGS.PATH.BLOGS}/${blog.id}`)
        .auth("admin5662", "qwerty")
        .expect(401);
    });

    it("2 - shouldn't delete blog and return status code 404 if id is not exist", async () => {
      await testManager.createUser();
      await testManager.createBlog();
      const blogsId = "662bb47c5ea70648a79f7c10";

      await request(app)
        .delete(`${SETTINGS.PATH.BLOGS}/${blogsId}`)
        .auth("admin", "qwerty")
        .expect(404);
    });

    it("3 - should delete blog and return status code 204", async () => {
      await testManager.createUser();
      const blog = await testManager.createBlog();

      await request(app)
        .delete(`${SETTINGS.PATH.BLOGS}/${blog.id}`)
        .auth("admin", "qwerty")
        .expect(204);
    });
  });
});
