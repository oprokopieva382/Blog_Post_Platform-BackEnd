import { request } from "./test-helpers";
import { SETTINGS } from "../src/settings";
describe("/videos tests", () => {
  beforeAll(() => {});

  it("should return empty array", async () => {
    const res = await request.get(SETTINGS.PATH.VIDEOS).expect(200);
    console.log(res.body);
  });

  it("shouldn't return empty array", async () => {
    const res = await request.get(SETTINGS.PATH.VIDEOS).expect(200);
    console.log(res.body);
  });
});
