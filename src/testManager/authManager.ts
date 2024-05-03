import request from "supertest";
import { app } from "../app";
import { SETTINGS } from "../settings";

export const authManager = {
  async createUser() {
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
      
    return newUser;
  },

  async loginUser() {
    const loginInput = {
      loginOrEmail: "Tina@gmail.com",
      password: "tina123",
    };
    return loginInput;
  },

  async userToken() {
    const user = await this.loginUser();
    const res = await request(app)
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .send(user)
      .expect(200);

    return res.body.accessToken;
  },
};
