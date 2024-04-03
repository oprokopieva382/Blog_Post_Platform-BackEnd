import { setDB } from "../src/db/db";
import { SETTINGS } from "../src/settings";
import { dataset1 } from "./datasets";
import { request } from "./test-helpers";

describe("/blogs test", () => {
  beforeAll(() => {
    setDB();
  });

  it("1 - should return empty array and status code of 200", async () => {
    const res = await request.get(SETTINGS.PATH.BLOGS).expect(200);

    expect(res.body.length).toBe(0);
  });

  
  it("2 - shouldn't return empty array and status code of 200", async () => {
     setDB(dataset1);

    const res = await request.get(SETTINGS.PATH.BLOGS).expect(200);

    expect(res.body.length).toBe(1);
  });
});
