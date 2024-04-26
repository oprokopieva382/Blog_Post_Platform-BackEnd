import request from "supertest";
import { SETTINGS } from "../src/settings";
import { app } from "../src/app";
import { ConnectMongoDB } from "../src/cloud_DB";

describe("/users test", () => {
  let userId: string;
  beforeAll(async () => {
     await ConnectMongoDB();
  });

  afterAll(async () => {

  });

  it("1 - should create user and return  status code of 201", async () => {
    const newUser = {
      login: "testUser",
      password: "string",
      email: "test@gmail.com",
    };
    const expectedResylr = {
      email: newUser.email,
      login: newUser.login,
      createdAt: expect.any(String),
      id: expect.any(String),
    };
    const res = await request(app)
      .post(SETTINGS.PATH.USERS)
      .send(newUser)
      .auth("admin", "qwerty")
      .expect(201);

    expect(res.body).toEqual(expectedResylr);
    userId = res.body.id;

    console.log(userId);
  });
});
