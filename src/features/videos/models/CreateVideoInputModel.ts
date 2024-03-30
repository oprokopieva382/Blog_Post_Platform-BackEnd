import { Resolutions } from "../input-output-types/video-types";

export type CreateVideoInputModel = {
  /**
   * Video title (required field)
   * Video author (required field)
   * Video availableResolutions (required field, should be one of [ P144, P240, P360, P480, P720, P1080, P1440, P2160 ])
   */
  title: string;
  author: string;
  availableResolutions: (keyof typeof Resolutions)[];
};
