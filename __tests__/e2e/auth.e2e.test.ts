import { ConnectMongoDB } from "../../src/cloud_DB";
import request from "supertest";
import { app } from "../../src/app";
import { SETTINGS } from "../../src/settings";
import { testManager } from "../../src/testManager";
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
      await testManager.createUser();
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
      await testManager.createUser();
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
      await testManager.createUser();
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
      await testManager.createUser();
      const { res, refreshToken } = await testManager.loginUser();
      const accessToken = res.body.data.accessToken;

      await request(app)
        .get(`${SETTINGS.PATH.AUTH}/me`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);
    });

    it("shouldn't auth me and return status code 401", async () => {
      await testManager.createUser();
      const { res, refreshToken } = await testManager.loginUser();
      const accessToken = res.body.data.accessToken;

      await request(app)
        .get(`${SETTINGS.PATH.AUTH}/me`)
        .set("Authorization", `Bearer ${accessToken}+1`)
        .expect(401);
    });
  });

  describe("LOG OUT", () => {
    it("should logout user and return status code of 204", async () => {
      await testManager.createUser();
      const { res, refreshToken } = await testManager.loginUser();

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/logout`)
        .set("Cookie", `refreshToken=${refreshToken}`)
        .expect(204);
    });

    it("shouldn't logout user and return status code of 401 if unauthorized", async () => {
      await testManager.createUser();
      const { res, refreshToken } = await testManager.loginUser();
      await testManager.addToBlacklistToken(refreshToken);

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/logout`)
        .set("Cookie", `refreshToken=${refreshToken}`)
        .expect(401);
    });
  });

  describe("REGISTRATION", () => {
    it("should register user and return status code of 204", async () => {
      const newUser = {
        login: "Tina",
        password: "tina123",
        email: "Tina@gmail.com",
      };

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/registration`)
        .send(newUser)
        .expect(204);
    });

    it("shouldn't register user and return status code of 400 if invalid inputs", async () => {
      const newUser = {
        login: "Tina",
        password: "tina123",
        email: "Tina", //not valid email, should be in pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
      };

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/registration`)
        .send(newUser)
        .expect(400);
    });
  });

  describe("REGISTRATION CONFIRMATION", () => {
    it("should confirm user registration by email link and return status code of 204", async () => {
      const code = await testManager.getConfirmCode();

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/registration-confirmation`)
        .send({ code })
        .expect(204);
    });

    it("shouldn't confirm user registration by email link and return status code of 400 if the confirmation code is incorrect", async () => {
      const code = "6654cc84aa3424d5f961994b"; //incorrect code

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/registration-confirmation`)
        .send({ code })
        .expect(400);
    });
  });

  describe("REFRESH TOKEN", () => {
    it("should request new refreshToken, return new accessToken & status code of 200", async () => {
      await testManager.createUser();
      const { res, refreshToken } = await testManager.loginUser();

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/refresh-token`)
        .set("Cookie", `refreshToken=${refreshToken}`)
        .set("Authorization", `Bearer ${res.body.data.accessToken}`)
        .expect(200);
    });

    it("should request new refreshToken but request failed as unauthorized user, return status code of 401", async () => {
      await testManager.createUser();
      const { res, refreshToken } = await testManager.loginUser();

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/refresh-token`)
        .set("Cookie", `refreshToken=${refreshToken}+1`)
        .set("Authorization", `Bearer ${res.body.data.accessToken}+1`)
        .expect(401);
    });
  });

  describe("REGISTRATION EMAIL RESENDING", () => {
    it("should resend email with confirmation link, return status code of 204", async () => {
      await testManager.registerUser();

      const email = {
        email: "Tina@gmail.com",
      };

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/registration-email-resending`)
        .send(email)
        .expect(204);
    });

    it("should fail the request resend-email with confirmation link, return status code of 400", async () => {
      await testManager.registerUser();
      const email = {
        email: "Tina@gmail", //not valid email, should be in pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
      };

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/registration-email-resending`)
        .send(email)
        .expect(400);
    });
  });
});
