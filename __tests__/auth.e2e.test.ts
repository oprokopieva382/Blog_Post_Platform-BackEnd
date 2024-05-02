import { ConnectMongoDB } from "../src/cloud_DB";
import request from "supertest";
import { app } from "../src/app";
import { SETTINGS } from "../src/settings";

describe("auth tests", () => {
  beforeAll(async () => {
    await ConnectMongoDB();
  });

  afterAll(async () => {});

  describe("AUTH LOGIN", () => {
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
      const dataWittLongPassword = {
        loginOrEmail: "Tina@gmail.com",
        password: "string123hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
      };

      const res = await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send(dataWittLongPassword)
        .expect(400);
    });

    // it("should login user and return JWT token with status code 200", async () => {

    // });
  });
});
