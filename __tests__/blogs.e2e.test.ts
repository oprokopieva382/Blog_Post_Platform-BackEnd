import request from "supertest";
import { SETTINGS } from "../src/settings";
import { app } from "../src/app";
import { ConnectMongoDB } from "../src/cloud_DB";
import { blogManager } from "./../src/testManager";

describe("/blogs test", () => {
  beforeAll(async () => {
    await ConnectMongoDB();
  });

  afterAll(async () => {});

  describe("CREATE BLOG", () => {
    it("1 - should create blog and return  status code of 201", async () => {
      const newBlog = await blogManager.createBlog();

      const res = await request(app)
        .post(SETTINGS.PATH.BLOGS)
        .send(newBlog)
        .auth("admin", "qwerty")
        .expect(201);
    });

    it("2 - shouldn't create blog and return  status code of 400", async () => {
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
      const newBlog = await blogManager.createBlog();

      const res = await request(app)
        .post(SETTINGS.PATH.BLOGS)
        .send(newBlog)
        .auth("admin252", "qwerty5252")
        .expect(401);
    });
  });

  describe("GET BLOGS", () => {
    it("1 - should get blogs and return status code 200 and object with pagination", async () => {
      const blogs = await blogManager.blogsWithPagination(1, 5);

      const res = await request(app)
        .get(SETTINGS.PATH.BLOGS)
        .send(blogs)
        .auth("admin", "qwerty")
        .expect(200);
      expect(blogs.page).toBe(1);
      expect(blogs.pageSize).toBe(5);
    });
  });

  describe("GET BLOG BY ID", () => {
    it("1 - should get blog and return status code 200 and object", async () => {
      const blogId = await blogManager.getBlogId();

      const blog = await blogManager.getBlogById(blogId);
      console.log(blog);

      const res = await request(app)
        .get(`${SETTINGS.PATH.BLOGS}/${blogId}`)
        .send(blog)
        .auth("admin", "qwerty")
        .expect(200);
    });

    it("shouldn't get blog and return status 404 if blogId is not exist", async () => {
      const blogId = "662bb47c5ea70648a79f7c10";
      const blog = await blogManager.getBlogById(blogId);

      const res = await request(app)
        .get(`${SETTINGS.PATH.BLOGS}/${blogId}`)
        .send(blog)
        .auth("admin", "qwerty")
        .expect(404);
    });
  });

  describe("UPDATE BLOG", () => {
    it("1 - should update blog and return status code 204", async () => {
      const blogId = await blogManager.getBlogId();
      const update = await blogManager.updateBlog();
      const res = await request(app)
        .put(`${SETTINGS.PATH.BLOGS}/${blogId}`)
        .send(update)
        .auth("admin", "qwerty")
        .expect(204);
    });

    it("2 - shouldn't update blog and return  status code of 400", async () => {
      const blogId = await blogManager.getBlogId();
      const update = {
        name: "Promise",
        description: "do you know promise well?",
        websiteUrl: "",
      };
      const res = await request(app)
        .put(`${SETTINGS.PATH.BLOGS}/${blogId}`)
        .send(update)
        .auth("admin", "qwerty")
        .expect(400);
      expect(res.body.errorsMessages.length).toBe(1);
    });

    it("3 - shouldn't update blog and return status code 401 if unauthorized", async () => {
      const blogId = await blogManager.getBlogId();
      const update = await blogManager.updateBlog();
      const res = await request(app)
        .put(`${SETTINGS.PATH.BLOGS}/${blogId}`)
        .send(update)
        .auth("admin00", "qwerty4")
        .expect(401);
    });

    it("4 - shouldn't update blog and return status code 404 if Id not found", async () => {
      const blogId = "662bb47c5ea70648a79f7c10";
      const update = await blogManager.updateBlog();
      const res = await request(app)
        .put(`${SETTINGS.PATH.BLOGS}/${blogId}`)
        .send(update)
        .auth("admin", "qwerty")
        .expect(404);
    });
  });

  it("3 - shouldn't delete blog and return status code 404 if id is not exist", async () => {
    const blogsId = "662bb47c5ea70648a79f7c10";
    const res = await request(app)
      .delete(`${SETTINGS.PATH.BLOGS}/${blogsId}`)
      .auth("admin", "qwerty")
      .expect(404);
  });
});

describe("GET BLOG POSTS", () => {
  it("should get blog posts and return object with pagination & status 200", async () => {
    const blogId = await blogManager.getBlogId();
    const posts = await blogManager.blogPostsWithPagination();

    const res = await request(app)
      .get(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
      .send(posts)
      .auth("admin", "qwerty")
      .expect(200);
  });

  it("shouldn't get blog posts and return status 404 if blogId is not exist", async () => {
    const blogId = "662bb47c5ea70648a79f7c10";
    const posts = await blogManager.blogPostsWithPagination();

    const res = await request(app)
      .get(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
      .send(posts)
      .auth("admin", "qwerty")
      .expect(404);
  });
});

describe("CREATE BLOG POST", () => {
  it("should create blog post and return object with status 201", async () => {
    const blogId = await blogManager.getBlogId();
    const newPost = await blogManager.createPost();

    const res = await request(app)
      .post(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
      .send(newPost)
      .auth("admin", "qwerty")
      .expect(201);
  });

  it("shouldn't create blog post and return status 404 if blogId is not exist", async () => {
    const blogId = "662bb47c5ea70648a79f7c10";
    const newPost = await blogManager.createPost();

    const res = await request(app)
      .post(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
      .send(newPost)
      .auth("admin", "qwerty")
      .expect(404);
  });

  it("shouldn't create blog post and return object with status 400 if incorrect input values ", async () => {
    const blogId = await blogManager.getBlogId();
    const newPost = {
      title: "Promise",
      shortDescription: "do you know promise well?",
      content: "",
    };

    const res = await request(app)
      .post(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
      .send(newPost)
      .auth("admin", "qwerty")
      .expect(400);

    expect(res.body.errorsMessages.length).toBe(1);
  });

  it("shouldn't create blog post and return object with status 401 if unauthorized ", async () => {
    const blogId = await blogManager.getBlogId();
    const newPost = await blogManager.createPost();

    const res = await request(app)
      .post(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
      .send(newPost)
      .auth("admin55", "qwertycc")
      .expect(401);
  });

  it("shouldn't create blog post and return status 404 if blogId is not exist", async () => {
    const blogId = "662bb47c5ea70648a79f7c10";
    const newPost = await blogManager.createPost();

    const res = await request(app)
      .post(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
      .send(newPost)
      .auth("admin", "qwerty")
      .expect(404);
  });
});

describe("DELETE BLOG", () => {
  it("1 - should delete blog and return status code 204", async () => {
    const blogs = await blogManager.getBlogs();
    const res = await request(app)
      .delete(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
      .auth("admin", "qwerty")
      .expect(204);
  });

  it("2 - shouldn't delete blog and return status code 401 if unauthorized", async () => {
    const blogs = await blogManager.getBlogs();
    const res = await request(app)
      .delete(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
      .auth("admin5662", "qwerty")
      .expect(401);
  });
});
