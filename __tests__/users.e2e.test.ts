import request from "supertest";
import { SETTINGS } from "../src/settings";
import { app } from "../src/app";
import { ConnectMongoDB } from "../src/cloud_DB";
import { userManager } from "./../src/testManager/userManager";

describe("/users test", () => {
  beforeAll(async () => {
    await ConnectMongoDB();
  });

  afterAll(async () => {});

  describe("CREATE USER", () => {
    it("1 - should create user and return  status code of 201", async () => {
      const newUser = await userManager.createUser();

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
      const newUser = await userManager.createUser();

      const res = await request(app)
        .post(SETTINGS.PATH.USERS)
        .send(newUser)
        .auth("admin252", "qwerty5252")
        .expect(401);
    });
  });

  describe("GET USERS", () => {
    it("1 - should get users and return status code 200 and object with pagination", async () => {
      const users = await userManager.createObjectWithPaginationAndUsers(1, 5);
      //console.log(users);

      const res = await request(app)
        .get(SETTINGS.PATH.USERS)
        .send(users)
        .auth("admin", "qwerty")
        .expect(200);
      expect(users.pagesCount).toBe(4);
      expect(users.items.length).toBe(20);
    });

    it("2 - shouldn't get users and return status code 401", async () => {
      const users = await userManager.createObjectWithPaginationAndUsers(1, 5);

      const res = await request(app)
        .get(SETTINGS.PATH.USERS)
        .send(users)
        .auth("adminll", "qwertyll")
        .expect(401);
    });

    it("3 - should delete user and return status code 204", async () => {
      const users = await userManager.createObjectWithPaginationAndUsers(1, 5);
     
      const res = await request(app)
        .delete(`${SETTINGS.PATH.USERS}/${users.items[0].id}`)
        .auth("admin", "qwerty")
        .expect(204);
    });
  });
});
