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

  afterEach(async () => {
    await dropCollections();
  });

  describe("AUTH LOGIN", () => {
    it("should login user and return status code 200", async () => {
      await authManager.createUser();
      const loginInput = {
        loginOrEmail: "Tina@gmail.com",
        password: "tina123",
      };

      const res = await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send(loginInput)
        .expect(200);

      expect(res.body.data).toEqual({
        accessToken: expect.any(String),
      });
    });

    it("shouldn't login user and return status code 401 if password or login is wrong", async () => {
      await authManager.createUser();
      const loginInput = {
        loginOrEmail: "Tina@gmail.com",
        password: "string123mjmj,j,j", //wrong password
      };

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send(loginInput)
        .expect(401);
    });

    it("shouldn't login user and return status code 400 if incorrect values", async () => {
      await authManager.createUser();
      const loginInput = {
        loginOrEmail: "Tina1@gmail.com", //incorrect email
        password: "string123",
      };

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send(loginInput)
        .expect(400);
    });
  });

  describe("AUTH ME", () => {
    it("should auth me return status code 200 and object", async () => {
      await authManager.createUser();
      const { res, refreshToken } = await authManager.loginUser();
      const accessToken = res.body.data.accessToken;

      await request(app)
        .get(`${SETTINGS.PATH.AUTH}/me`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);
    });

    it("shouldn't auth me and return status code 401", async () => {
      await authManager.createUser();
      const { res, refreshToken } = await authManager.loginUser();
      const accessToken = res.body.data.accessToken;

      await request(app)
        .get(`${SETTINGS.PATH.AUTH}/me`)
        .set("Authorization", `Bearer ${accessToken}+1`)
        .expect(401);
    });
  });

  describe("LOG OUT", () => {
    it("should logout user and return status code of 204", async () => {
      await authManager.createUser();
      const { res, refreshToken } = await authManager.loginUser();

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/logout`)
        .set("Cookie", `refreshToken=${refreshToken}`)
        .expect(204);
    });

    it("shouldn't logout user and return status code of 401 if unauthorized", async () => {
      await authManager.createUser();
      const { res, refreshToken } = await authManager.loginUser();
      await authManager.addToBlacklistToken(refreshToken);

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/logout`)
        .set("Cookie", `refreshToken=${refreshToken}`)
        .expect(401);
    });
  });
});
