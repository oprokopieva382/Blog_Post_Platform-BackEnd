import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { request } from "./test-helpers";
import { SETTINGS } from "../src/settings";

describe("/users test", () => {
  let server: any;
  let client: MongoClient;
  beforeAll(async () => {
    server = await MongoMemoryServer.create();
    const uri = server.getUri();
    client = new MongoClient(uri);
    await client.connect();
  });

 afterAll(async () => {
   if (client) {
     await client.close();
   }
   if (server) {
     await server.stop();
   }
 });

  describe("create user", () => {
    it("1 - should create user and return  status code of 201", async () => {
      const newUser = {
        login: "testUser",
        password: "string",
        email: "test@gmail.com",
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
