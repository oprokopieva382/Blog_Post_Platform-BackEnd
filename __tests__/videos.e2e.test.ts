import { request } from "./test-helpers";
import { SETTINGS } from "../src/settings";
import { db, setDB } from "../src/db/db";
import {
  InputVideoType,
  Resolutions,
} from "../src/features/videos/input-output-types/video-types";
import { dataset1 } from "./datasets";
import { OutputErrorsType } from "../src/features/videos/input-output-types/output-errors-type";

describe("/videos tests", () => {
  beforeAll(() => {});

  it("1 - should return empty array and status code of 200", async () => {
    setDB();
    const res = await request.get(SETTINGS.PATH.VIDEOS).expect(200);

    expect(res.body.length).toBe(0);
  });

  it("2 - shouldn't return empty array and status code of 200", async () => {
    setDB(dataset1);
    const res = await request.get(SETTINGS.PATH.VIDEOS).expect(200);

    expect(res.body.length).toBe(1);
  });

  it("3 - should return video by ID and status code of 200", async () => {
    setDB(dataset1);

    const foundVideo = db.videos[0];

    const res = await request
      .get(`${SETTINGS.PATH.VIDEOS}/${foundVideo.id}`)
      .send(foundVideo)
      .expect(200);

    expect(res.body.id).toEqual(foundVideo.id);
  });

  it("4 - shouldn't return video if ID not found and status code of 404", async () => {
    setDB(dataset1);

    const notExistingVideoId = "171155323290255";

    await request
      .get(`${SETTINGS.PATH.VIDEOS}/${notExistingVideoId}`)
      .expect(404);
  });

  it("5 - should create & return new video with status code 201", async () => {
    setDB();

    const newVideo: InputVideoType = {
      id: Math.floor(Date.now() + Math.random() * 1000000),
      title: "rest api",
      author: "code mosh",
      availableResolutions: [Resolutions.P144],
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    const res = await request
      .post(SETTINGS.PATH.VIDEOS)
      .send(newVideo)
      .expect(201);
    expect(res.body.availableResolutions).toEqual(
      newVideo.availableResolutions
    );
  });

  it("6 - shouldn't create new video with incorrect input & return status code 400", async () => {
    setDB();

    let errors: OutputErrorsType = {
      errorsMessages: [],
    };

    const testCases = [
      {
        data: { title: "" },
        expectedError: { message: "title field is required", field: "title" },
      },
      {
        data: { author: "" },
        expectedError: {
          message: "author field is required",
          field: "author",
        },
      },
      {
        data: { availableResolutions: [] },
        expectedError: {
          message: "at least one resolution should be added",
          field: "availableResolutions",
        },
      },
    ];

    for (const testCase of testCases) {
      await request.post(SETTINGS.PATH.VIDEOS).send(testCase.data).expect(400);

      errors.errorsMessages.push(testCase.expectedError);
    }

    const res = await request
      .post(SETTINGS.PATH.VIDEOS)
      .send(errors)
      .expect(400);

    console.log(errors);
  });

  it("7 - should delete video by ID and return status code of 204", async () => {
    setDB(dataset1);

    const video = db.videos[0];

    const res = await request
      .delete(`${SETTINGS.PATH.VIDEOS}/${video.id}`)
      .expect(204);
  });

  it("8 - shouldn't delete video if ID not found and return status code of 404", async () => {
    setDB(dataset1);

    const notExistingVideoId = "171155323290255";

    const res = await request
      .delete(`${SETTINGS.PATH.VIDEOS}/${notExistingVideoId}`)
      .expect(404);
  });

  it("9 - should update video by id & return new video with status code 204", async () => {
    setDB(dataset1);
    const videoToUpdate = db.videos[0];
    console.log(videoToUpdate.id);
    const dataToUpdate = { ...videoToUpdate, title: "REST API" };

    const res = await request
      .put(`${SETTINGS.PATH.VIDEOS}/${videoToUpdate.id}`)
      .send(dataToUpdate)
      .expect(204);
  });

  it("10 - shouldn't update video if id not found & return status code 404", async () => {
    setDB(dataset1);
    const notExistingVideoId = "171155323290255";

    const res = await request
      .put(`${SETTINGS.PATH.VIDEOS}/${notExistingVideoId}`)
      .expect(404);
  });

  it("11 - shouldn't update video with incorrect input & return status code 400", async () => {
    setDB();

    let errors: OutputErrorsType = {
      errorsMessages: [],
    };

    const testCases = [
      {
        data: { title: "A".repeat(41) },
        expectedError: { message: "max length 40 characters", field: "title" },
      },
      {
        data: { title: "A".repeat(41) },
        expectedError: { message: "max length 40 characters", field: "author" },
      },
      {
        data: { minAgeRestriction: 0 },
        expectedError: {
          message: "the age restriction should be between 1 and 18",
          field: "minAgeRestriction",
        },
      },
      {
        data: { minAgeRestriction: 19 },
        expectedError: {
          message: "the age restriction should be between 1 and 18",
          field: "minAgeRestriction",
        },
      },
      {
        data: { availableResolutions: [] },
        expectedError: {
          message: "at least one resolution should be added",
          field: "availableResolutions",
        },
      },
    ];

    for (const testCase of testCases) {
      await request.post(SETTINGS.PATH.VIDEOS).send(testCase.data).expect(400);

      errors.errorsMessages.push(testCase.expectedError);
    }

    const res = await request
      .post(SETTINGS.PATH.VIDEOS)
      .send(errors)
      .expect(400);

    console.log(errors);
  });
});
