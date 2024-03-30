import { DBType } from "../src/db/db";
import { VideoDbType } from "../src/db/video-db-type";
import { Resolutions } from "../src/features/videos/input-output-types/output-video-types";

export const video1: VideoDbType = {
  id: Math.floor(Date.now() + Math.random() * 1000000),
  title: "MongoDB",
  author: "UCF",
  canBeDownloaded: false,
  minAgeRestriction: null,
  createdAt: new Date().toISOString(),
  publicationDate: new Date(
    new Date().getTime() + 24 * 60 * 60 * 1000
  ).toISOString(),
  availableResolutions: [Resolutions.P240],
};

export const dataset1: DBType = {
  videos: [video1],
};
