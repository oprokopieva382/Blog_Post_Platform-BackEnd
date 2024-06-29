import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../src/app";
import { ConnectMongoDB } from "../../src/cloud_DB";
import { SETTINGS } from "../../src/settings";
import { testManager } from "./test-helpers";
import { dropCollections } from "./dropCollections";

const environmentStatus = `${SETTINGS.TESTING_ENVIRONMENT_STATUS}`;

describe("auth tests", () => {
  beforeAll(async () => {
    await ConnectMongoDB(environmentStatus);
  });

  afterEach(async () => {
    await dropCollections();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("AUTH LOGIN", () => {
    it("1 - should login user and return status code 200", async () => {
      await testManager.createUser();
      const loginInput = {
        loginOrEmail: "Tina@gmail.com",
        password: "tina123",
      };

      const res = await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send(loginInput)
        .expect(200);

      expect(res.body).toEqual({
        accessToken: expect.any(String),
      });
    });

    it("2 - shouldn't login user and return status code 401 if password or login is wrong", async () => {
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

    it("3 - shouldn't login user and return status code 400 if incorrect values", async () => {
      await testManager.createUser();
      const loginInput = {
        loginOrEmail: "", //incorrect email, field required
        password: "string123",
      };

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send(loginInput)
        .expect(400);
    });

    it("4 - should fail the request because more than 5 attempts from one IP-address during 10 seconds, return status code of 429", async () => {
      await testManager.createUser();
      const loginInput = {
        loginOrEmail: "Tina@gmail.com",
        password: "tina123",
      };
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post(`${SETTINGS.PATH.AUTH}/login`)
          .send(loginInput)
          .expect(200);
      }

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send(loginInput)
        .expect(429);
    });
  });

  describe("AUTH ME", () => {
    it("1 - should auth me return status code 200 and object", async () => {
      await testManager.createUser();
      const { res, refreshToken } = await testManager.loginUser();
      const accessToken = res.body.accessToken;

      await request(app)
        .get(`${SETTINGS.PATH.AUTH}/me`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);
    });

    it("2- shouldn't auth me and return status code 401", async () => {
      await testManager.createUser();
      const { res, refreshToken } = await testManager.loginUser();
      const accessToken = res.body.accessToken;

      await request(app)
        .get(`${SETTINGS.PATH.AUTH}/me`)
        .set("Authorization", `Bearer ${accessToken}+1`)
        .expect(401);
    });
  });

  describe("LOG OUT", () => {
    it("1 - should logout user and return status code of 204", async () => {
      await testManager.createUser();
      const { res, refreshToken } = await testManager.loginUser();

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/logout`)
        .set("Cookie", `refreshToken=${refreshToken}`)
        .expect(204);
    });

    it("2 - shouldn't logout user and return status code of 401 if unauthorized", async () => {
      await testManager.createUser();
      const { res, refreshToken } = await testManager.loginUser();

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/logout`)
        .set("Cookie", `refreshToken=${refreshToken}+1`)
        .expect(401);
    });
  });

  describe("REGISTRATION", () => {
    it("1 - should register user and return status code of 204", async () => {
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

    it("2 - shouldn't register user and return status code of 400 if invalid inputs", async () => {
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

    it("3 - should fail the request because more than 5 attempts from one IP-address during 10 seconds, return status code of 429", async () => {
      const newUser = {
        login: "Tina",
        password: "tina123",
        email: "Tina@gmail.com",
      };
      await testManager.registerFiveUsers();

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/registration`)
        .send(newUser)
        .expect(429);
    });
  });

  describe("REGISTRATION CONFIRMATION", () => {
    it("1 - should confirm user registration by email link and return status code of 204", async () => {
      const code = await testManager.getConfirmCode();

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/registration-confirmation`)
        .send({ code })
        .expect(204);
    });

    it("2 - shouldn't confirm user registration by email link and return status code of 400 if the confirmation code is incorrect", async () => {
      const code = "6654cc84aa3424d5f961994b"; //incorrect code

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/registration-confirmation`)
        .send({ code })
        .expect(400);
    });
  });

  describe("REFRESH TOKEN", () => {
    it("1 - should request new refreshToken, return new accessToken & status code of 200", async () => {
      await testManager.createUser();
      const { res, refreshToken } = await testManager.loginUser();

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/refresh-token`)
        .set("Cookie", `refreshToken=${refreshToken}`)
        .set("Authorization", `Bearer ${res.body.accessToken}`)
        .expect(200);
    });

    it("2 - should request new refreshToken but request failed as unauthorized user, return status code of 401", async () => {
      await testManager.createUser();
      const { res, refreshToken } = await testManager.loginUser();

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/refresh-token`)
        .set("Cookie", `refreshToken=${refreshToken}+1`)
        .set("Authorization", `Bearer ${res.body.accessToken}+1`)
        .expect(401);
    });
  });

  describe("REGISTRATION EMAIL RESENDING", () => {
    it("1 - should resend email with confirmation link, return status code of 204", async () => {
      await testManager.registerUser();

      const email = {
        email: "Tina@gmail.com",
      };

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/registration-email-resending`)
        .send(email)
        .expect(204);
    });

    it("2 - should fail the request resend-email with confirmation link, return status code of 400", async () => {
      await testManager.registerUser();
      const email = {
        email: "Tina@gmail", //not valid email, should be in pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
      };

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/registration-email-resending`)
        .send(email)
        .expect(400);
    });

    it("3 - should fail the request because more than 5 attempts from one IP-address during 10 seconds, return status code of 429", async () => {
      await testManager.registerUser();

      const email = {
        email: "Tina@gmail.com",
      };

      for (let i = 0; i < 5; i++) {
        await request(app)
          .post(`${SETTINGS.PATH.AUTH}/registration-email-resending`)
          .send(email)
          .expect(204);
      }

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/registration-email-resending`)
        .send(email)
        .expect(429);
    });
  });
});
