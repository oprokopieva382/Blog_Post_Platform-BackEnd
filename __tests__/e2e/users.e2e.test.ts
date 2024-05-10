import request from "supertest";
import { SETTINGS } from "../../src/settings";
import { app } from "../../src/app";
import { ConnectMongoDB } from "../../src/cloud_DB";
import { userManager } from "../../src/testManager";

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
      const users = await userManager.usersWithPagination(1, 5);
      console.log(users);

      const res = await request(app)
        .get(SETTINGS.PATH.USERS)
        .send(users)
        .auth("admin", "qwerty")
        .expect(200);
      expect(users.page).toBe(1);
      expect(users.pageSize).toBe(5);
    });

    it("2 - shouldn't get users and return status code 401 if unauthorized", async () => {
      const users = await userManager.getUsers();

      const res = await request(app)
        .get(SETTINGS.PATH.USERS)
        .send(users)
        .auth("adminll", "qwertyll")
        .expect(401);
    });
  });

  describe("DELETE USERS", () => {
    it("1 - should delete user and return status code 204", async () => {
      const users = await userManager.getUsers();

      const res = await request(app)
        .delete(`${SETTINGS.PATH.USERS}/${users[0].id}`)
        .auth("admin", "qwerty")
        .expect(204);
    });

    it("2 - shouldn't delete user and return status code 401 if unauthorized", async () => {
      const users = await userManager.getUsers();

      const res = await request(app)
        .delete(`${SETTINGS.PATH.USERS}/${users[0].id}`)
        .auth("admin5662", "qwerty")
        .expect(401);
    });

    it("3 - shouldn't delete user and return status code 404 if id is not exist", async () => {
      const usersId = "662bb47c5ea70648a79f7c10";

      const res = await request(app)
        .delete(`${SETTINGS.PATH.USERS}/${usersId}`)
        .auth("admin", "qwerty")
        .expect(404);
    });
  });
});
