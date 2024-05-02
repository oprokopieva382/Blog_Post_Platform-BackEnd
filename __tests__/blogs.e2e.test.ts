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
    // it("1 - should create blog and return  status code of 201", async () => {
    //   const newBlog = await blogManager.createBlog();

    //   const res = await request(app)
    //     .post(SETTINGS.PATH.BLOGS)
    //     .send(newBlog)
    //     .auth("admin", "qwerty")
    //     .expect(201);
    // });

    it("2 - shouldn't create blog and return  status code of 400", async () => {
      const newBlog = {
        name: "",
        description: "",
        websiteUrl: ""
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

//   describe("UPDATE POSTS", () => {
//     it("1 - should update posts and return status code 204", async () => {
//       const postId = await postManager.getPostId();
//       const update = await postManager.updatePost();
//       const res = await request(app)
//         .put(`${SETTINGS.PATH.POSTS}/${postId}`)
//         .send(update)
//         .auth("admin", "qwerty")
//         .expect(204);
//     });

//     it("2 - shouldn't update post and return  status code of 400", async () => {
//       const postId = await postManager.getPostId();
//       const update = {
//         title: "",
//         shortDescription: "",
//         content: "",
//         blogId: "662bf8758f1a93a2082eb4ee",
//       };

//       const res = await request(app)
//         .put(`${SETTINGS.PATH.POSTS}/${postId}`)
//         .send(update)
//         .auth("admin", "qwerty")
//         .expect(400);

//       expect(res.body.errorsMessages.length).toBe(3);
//     });

//     it("3 - shouldn't update posts and return status code 401", async () => {
//       const postId = await postManager.getPostId();
//       const update = await postManager.updatePost();
//       const res = await request(app)
//         .put(`${SETTINGS.PATH.POSTS}/${postId}`)
//         .send(update)
//         .auth("admin00", "qwerty4")
//         .expect(401);
//     });

//     it("4 - shouldn't update posts and return status code 404 if Id not found", async () => {
//       const postId = "662bb47c5ea70648a79f7c10";
//       const update = await postManager.updatePost();
//       const res = await request(app)
//         .put(`${SETTINGS.PATH.POSTS}/${postId}`)
//         .send(update)
//         .auth("admin", "qwerty")
//         .expect(404);
//     });
//   });

//   describe("DELETE PostS", () => {
//     it("1 - should delete post and return status code 204", async () => {
//       const posts = await postManager.getPosts();
//       console.log(posts);

//       const res = await request(app)
//         .delete(`${SETTINGS.PATH.POSTS}/${posts[1].id}`)
//         .auth("admin", "qwerty")
//         .expect(204);
//     });

//     it("2 - shouldn't delete post and return status code 401 if unauthorized", async () => {
//       const posts = await postManager.getPosts();

//       const res = await request(app)
//         .delete(`${SETTINGS.PATH.POSTS}/${posts[1].id}`)
//         .auth("admin5662", "qwerty")
//         .expect(401);
//     });

//     it("3 - shouldn't delete post and return status code 404 if id is not exist", async () => {
//       const postsId = "662bb47c5ea70648a79f7c10";

//       const res = await request(app)
//         .delete(`${SETTINGS.PATH.POSTS}/${postsId}`)
//         .auth("admin", "qwerty")
//         .expect(404);
//     });
  //});
});
