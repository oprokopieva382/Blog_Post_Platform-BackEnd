import { ConnectMongoDB } from "../../src/cloud_DB";
import request from "supertest";
import { app } from "../../src/app";
import { SETTINGS } from "../../src/settings";
import { authManager } from "../../src/testManager";
import { dropCollections } from "../../src/testManager/dropCollections";

describe("auth tests", () => {
  beforeAll(async () => {
    await ConnectMongoDB();
  });

  afterAll(async () => {
    await dropCollections();
  });

  describe("AUTH LOGIN", () => {
    it("should login user and return status code 200", async () => {
      const createUser = await authManager.createUser();
      const user = await authManager.loginUser();

      const res = await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send(user)
        .expect(200);
    });

    it("shouldn't login user and return status code 401 if password or login is wrong", async () => {
      const dataWithWrongEmail = {
        loginOrEmail: "Tina1@gmail.com",
        password: "string123",
      };

      const res = await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send(dataWithWrongEmail)
        .expect(401);
    });

    it("shouldn't login user and return status code 400 if incorrect values", async () => {
      const dataWithLongPassword = {
        loginOrEmail: "Tina@gmail.com",
        password: "string123hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
      };

      const res = await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send(dataWithLongPassword)
        .expect(400);
    });
  });

  describe("AUTH ME", () => {
    it("should auth me return status code 200 and object", async () => {
      const token = await authManager.userToken();
      const res = await request(app)
        .get(`${SETTINGS.PATH.AUTH}/me`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });

    it("shouldn't auth me and return status code 401", async () => {
      const token = await authManager.userToken();
      const res = await request(app)
        .get(`${SETTINGS.PATH.AUTH}/me`)
        .set("Authorization", `Bearer ${token}+1`)
        .expect(401);
    });
  });
});
