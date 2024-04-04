import { db, setDB } from "../src/db/db";
import { SETTINGS } from "../src/settings";
import { blog1, dataset1 } from "./datasets";
import { request } from "./test-helpers";

describe("/blogs test", () => {
  beforeAll(() => {
    setDB();
  });

  it("1 - should return empty array and status code of 200", async () => {
    const res = await request.get(SETTINGS.PATH.BLOGS).expect(200);

    expect(res.body.length).toBe(0);
  });

  it("2 - get blogs request with status code of 200", async () => {
    setDB(dataset1);

    const res = await request.get(SETTINGS.PATH.BLOGS).expect(200);

    expect(res.body.length).toBe(db.blogs.length);
    expect(res.body).toEqual(db.blogs);
  });

  it("3 - get blogs request by id with status code of 200", () => {
    setDB(dataset1);
    const blog = db.blogs[0];
    request.get(`${SETTINGS.PATH.BLOGS}/${blog.id}`).send(blog).expect(200);
  });

  it("4 - get blogs request by id with status code of 404", async () => {
    setDB(dataset1);
    const notExistingBlogID = "12345678";
    const res = await request
      .get(`${SETTINGS.PATH.BLOGS}/${notExistingBlogID}`)
      .expect(404);
    expect(db.blogs[0].id).not.toBe(notExistingBlogID);
  });

  it("5 - should create & return new blog with auth & status code 201", async () => {
    const newBlog = blog1;

    const buff2 = Buffer.from(SETTINGS.ADMIN_AUTH, "utf8");
    const codedAuth = buff2.toString("base64");

    const res = await request
      .post(SETTINGS.PATH.BLOGS)
      .set({ Authorization: "Basic " + codedAuth })
      .send(newBlog)
      .expect(201);

    expect(res.body.name).toEqual(db.blogs[0].name);
  });

  it("6 - shouldn't create new blog with no auth & status code 401", async () => {
    const buff2 = Buffer.from(SETTINGS.ADMIN_AUTH, "utf8");
    const incorrectCodedAuth = buff2.toString("base64") + "a";

    const res = await request
      .post(SETTINGS.PATH.BLOGS)
      .set({ Authorization: "Basic " + incorrectCodedAuth })
      .expect(401);
  });

  it("7 - shouldn't create blog with incorrect input value & status code 400", async () => {
    const buff2 = Buffer.from(SETTINGS.ADMIN_AUTH, "utf8");
    const codedAuth = buff2.toString("base64");

    const incorrectInputValue = {
      name: "Namelonggggggggggg",
    };

    const res = await request
      .post(SETTINGS.PATH.BLOGS)
      .set({ Authorization: "Basic " + codedAuth })
      .send(incorrectInputValue)
      .expect(400);
  });

  it("8 - should update blog by id with auth & return status code 204", async () => {
    const blogToUpdate = db.blogs[0];

    const dataToUpdate = { ...blogToUpdate, name: "Memo" };
    const id = blogToUpdate.id;

    const buff2 = Buffer.from(SETTINGS.ADMIN_AUTH, "utf8");
    const codedAuth = buff2.toString("base64");

    const res = await request
      .put(`${SETTINGS.PATH.BLOGS}/${id}`)
      .set({ Authorization: "Basic " + codedAuth })
      .send(dataToUpdate)
      .expect(204);
  });

  it("9 - should delete blog by id with auth & return status code 204", async () => {
    const blogToDeleteId = db.blogs[0].id;

    const buff2 = Buffer.from(SETTINGS.ADMIN_AUTH, "utf8");
    const codedAuth = buff2.toString("base64");

    const res = await request
      .put(`${SETTINGS.PATH.BLOGS}/${blogToDeleteId}`)
      .set({ Authorization: "Basic " + codedAuth })
      .expect(204);
  });
});
