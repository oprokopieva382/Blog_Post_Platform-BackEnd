import request from "supertest";
import { SETTINGS } from "../../src/settings";
import { app } from "../../src/app";
import { ConnectMongoDB } from "../../src/cloud_DB";
import { dropCollections } from "../e2e/dropCollections";
import { testManager } from "./test-helpers";

const environmentStatus = `${SETTINGS.TESTING_ENVIRONMENT_STATUS}`;

describe("/users test", () => {
  beforeAll(async () => {
    await ConnectMongoDB(environmentStatus);
  });

  afterEach(async () => {
    await dropCollections();
  });

  describe("CREATE USER", () => {
    it("1 - should create user and return  status code of 201", async () => {
      const newUser = {
        login: "Tina",
        password: "tina123",
        email: "Tina@gmail.com",
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
        login: "Tina",
        password: "tina123",
        email: "Tina@gmail.com",
      };

      await request(app)
        .post(SETTINGS.PATH.USERS)
        .send(newUser)
        .auth("admin252", "qwerty5252")
        .expect(401);
    });
  });

  describe("GET USERS", () => {
    it("1 - should get users and return status code 200 and object with pagination", async () => {
      await testManager.createUser();

      const res = await request(app)
        .get(SETTINGS.PATH.USERS)
        .auth("admin", "qwerty")
        .expect(200);

      expect(res.body.page).toBe(1);
      expect(res.body.pageSize).toBe(10);
    });

    it("2 - shouldn't get users and return status code 401 if unauthorized", async () => {
      await testManager.createUser();

      await request(app)
        .get(SETTINGS.PATH.USERS)
        .auth("adminll", "qwertyll")
        .expect(401);
    });
  });

  describe("DELETE USER", () => {
    it("1 - should delete user and return status code 204", async () => {
      await testManager.createUser();
      const user = await testManager.getUser();

      await request(app)
        .delete(`${SETTINGS.PATH.USERS}/${user.items[0].id}`)
        .auth("admin", "qwerty")
        .expect(204);
    });

    it("2 - shouldn't delete user and return status code 401 if unauthorized", async () => {
      await testManager.createUser();
      const user = await testManager.getUser();

      await request(app)
        .delete(`${SETTINGS.PATH.USERS}/${user.id}`)
        .auth("admin5662", "qwerty")
        .expect(401);
    });

    it("3 - shouldn't delete user and return status code 404 if id is not exist", async () => {
      await testManager.createUser();
      const usersId = "662bb47c5ea70648a79f7c10";

      await request(app)
        .delete(`${SETTINGS.PATH.USERS}/${usersId}`)
        .auth("admin", "qwerty")
        .expect(404);
    });
  });
});
