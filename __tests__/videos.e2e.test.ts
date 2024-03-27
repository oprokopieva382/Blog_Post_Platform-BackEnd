import { request } from "./test-helpers";
import { SETTINGS } from "../src/settings";
import { db, setDB } from "../src/db/db";
import {
  InputVideoType,
  Resolutions,
} from "../src/features/videos/input-output-types/video-types";
import { dataset1 } from "./datasets";
describe("/videos tests", () => {
  beforeAll(() => {});

  it("should return empty array and status code of 200", async () => {
    setDB();
    const res = await request.get(SETTINGS.PATH.VIDEOS).expect(200);
    console.log(res.body);
    expect(res.body.length).toBe(0);
  });

  it("shouldn't return empty array and status code of 200", async () => {
    setDB(dataset1);
    const res = await request.get(SETTINGS.PATH.VIDEOS).expect(200);
    console.log(res.body);
    expect(res.body.length).toBe(1);
  });

  it("should return video by ID and status code of 200", async () => {
    setDB(dataset1);

    const videoId = db.videos[0].id;

    const res = await request
      .get(`${SETTINGS.PATH.VIDEOS}/${videoId}`)
      .expect(200);

    expect(res.body).toBeDefined();
    console.log(`videoId id ${videoId}`);
  });

  it("shouldn't return video if ID not found and status code of 404", async () => {
    setDB(dataset1);

    const notExistingVideoId = "171155323290255";

    await request
      .get(`${SETTINGS.PATH.VIDEOS}/${notExistingVideoId}`)
      .expect(404);
  });

  // it("should create new video", async () => {
  //   setDB();

  //   const newVideo: InputVideoType = {
  //     title: "rest api",
  //     author: "code mosh",
  //     availableResolutions: [Resolutions.P144],
  //   };

  //   const res = await request
  //     .post(SETTINGS.PATH.VIDEOS)
  //     .send(newVideo)
  //     .expect(201);
  //   expect(res.body.availableResolutions).toEqual(
  //     newVideo.availableResolutions
  //   );
  // });
});
