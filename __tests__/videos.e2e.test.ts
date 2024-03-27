import { request } from "./test-helpers";
import { SETTINGS } from "../src/settings";
import { setDB } from "../src/db/db";
import {
  InputVideoType,
  Resolutions,
} from "../src/features/videos/input-output-types/video-types";
import { dataset1 } from "./datasets";
describe("/videos tests", () => {
  beforeAll(() => {});

   it("should return empty array", async () => {
    setDB();
    const res = await request.get(SETTINGS.PATH.VIDEOS).expect(200);
    console.log(res.body);
  });

  it("shouldn't return empty array", async () => {
     setDB(dataset1);
    const res = await request.get(SETTINGS.PATH.VIDEOS).expect(200);
    console.log(res.body);
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
