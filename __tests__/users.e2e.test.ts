import request from "supertest";
import { SETTINGS } from "../src/settings";
import { app } from "../src/app";
import { ConnectMongoDB } from "../src/cloud_DB";

describe("/users test", () => {
  beforeAll(async () => {
    await ConnectMongoDB();
  });

  afterAll(async () => {});

  describe("CREATE USER", () => {
    it("1 - should create user and return  status code of 201", async () => {
      const newUser = {
        login: "testUser",
        password: "string",
        email: "test@gmail.com",
      };

      const res = await request(app)
        .post(SETTINGS.PATH.USERS)
        .send(newUser)
        .auth("admin", "qwerty")
        .expect(201);

      expect(res.body).toEqual({
        email: newUser.email,
        login: newUser.login,
        createdAt: expect.any(String),
        id: expect.any(String),
      });
    });

    it("2 - shouldn't create user and return  status code of 400", async () => {
      const newUser = {
        login: "",
        password: "",
        email: "",
      };

      const res = await request(app)
        .post(SETTINGS.PATH.USERS)
        .send(newUser)
        .auth("admin", "qwerty")
        .expect(400);

      expect(res.body.errorsMessages.length).toBe(3);
    });

    it("3 - shouldn't create user if unauthorized and return  status code of 401", async () => {
      const newUser = {
        login: "testUser",
        password: "string",
        email: "test@gmail.com",
      };

      const res = await request(app)
        .post(SETTINGS.PATH.USERS)
        .send(newUser)
        .auth("admin252", "qwerty5252")
        .expect(401);
    });
  });
});
