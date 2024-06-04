import request from "supertest";
import { app } from "../app";
import { SETTINGS } from "../settings";
import { blackListTokenCollection } from "../cloud_DB";

export const authManager = {
  async createUser() {
    const newUser = {
      login: "Tina",
      password: "tina123",
      email: "Tina@gmail.com",
    };

    await request(app)
      .post(SETTINGS.PATH.USERS)
      .send(newUser)
      .auth("admin", "qwerty")
      .expect(201);

    return newUser;
  },

  async loginUser() {
    const loginInput = {
      loginOrEmail: "Tina@gmail.com",
      password: "tina123",
    };

    const res = await request(app)
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .send(loginInput)
      .expect(200);

    const cookies = res.headers["set-cookie"];
    const cookieArray = Array.isArray(cookies) ? cookies : [cookies];

    const refreshToken = cookieArray
      .find((cookie: string) => cookie.startsWith("refreshToken="))
      .split(";")[0]
      .split("=")[1];

    return { res, refreshToken };
  },

  async addToBlacklistToken(refreshToken: string) {
    return await blackListTokenCollection.insertOne({refreshToken});
  },
};
