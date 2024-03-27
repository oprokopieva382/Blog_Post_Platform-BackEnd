import { Resolutions } from "../features/videos/input-output-types/video-types";

export type VideoDbType = {
  id: number;
  title: string;
  author?: string;
  canBeDownloaded?: boolean;
  minAgeRestriction?: number;
  createdAt?: string;
  publicationDate?: string;
  availableResolutions?: (keyof typeof Resolutions)[] | null;
};