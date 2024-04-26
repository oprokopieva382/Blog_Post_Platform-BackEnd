import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { request } from "./test-helpers";
import { SETTINGS } from "../src/settings";

describe("/users test", () => {
  let server: any;
  beforeAll(async () => {
    server = await MongoMemoryServer.create();
    const uri = server.getUri();
    const client: MongoClient = new MongoClient(uri);
    await client.connect();
  });

  afterAll(async () => {
    await server.stop();
  });

  describe("create user", () => {
    it("1 - should create user and return  status code of 201", async () => {
      const newUser = {
        login: "KGT4HonHV3",
        password: "string",
        email: "RL4_55tmylXFE58xGvNvU@gmail.com",
      };
      const res = await request
        .post(SETTINGS.PATH.USERS)
        .send(newUser)
        //.set({ Authorization: "Basic admin:qwerty" })
        .auth("admin", "qwerty")
        .expect(201);

      //expect(res.body).toBe(newUser);
    });
  });
});
