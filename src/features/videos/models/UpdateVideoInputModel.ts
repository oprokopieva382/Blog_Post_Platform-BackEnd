import { Resolutions } from "../input-output-types/output-video-types";

export type UpdateVideoInputModel = {
  /**
   * Video title (required field)
   * Video author (required field)
   * Video availableResolutions (required field, should be one of [ P144, P240, P360, P480, P720, P1080, P1440, P2160 ])
   * Is video canBeDownloaded (default - false)
   * Video minAgeRestriction (min-1, max-18, null - no restriction)
   * Video publicationDate (default - +1 day from CreatedAt)
   */
  title: string;
  author: string;
  availableResolutions: (keyof typeof Resolutions)[];
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  publicationDate: string;
};
