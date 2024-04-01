import { APIErrorResult } from "../features/videos/input-output-types/output-errors-type";
import {
  Resolutions,
  Video,
} from "../features/videos/input-output-types/output-video-types";

export const createValidation = (data: Video) => {
  let errors: APIErrorResult = {
    errorsMessages: [],
  };

  if (data.author && data.author.length > 20) {
    errors.errorsMessages.push({
      message: "max length 20 characters",
      field: "author",
    });
  }

  if (data.title && data.title.length > 40) {
    errors.errorsMessages.push({
      message: "max length 40 characters",
      field: "title",
    });
  }

  if (!data.author) {
    errors.errorsMessages.push({
      message: "author field is required",
      field: "author",
    });
  }

  if (!data.title) {
    errors.errorsMessages.push({
      message: "title field is required",
      field: "title",
    });
  }

  const invalidResolutions =
    data.availableResolutions?.filter(
      (resolution) =>
        !Object.values(Resolutions).includes(resolution as Resolutions)
    ) ?? [];

  if (invalidResolutions.length > 0) {
    errors.errorsMessages.push({
      message:
        "available resolutions can only contain values of 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'",
      field: "availableResolutions",
    });
  }

  if (!data.availableResolutions) {
    errors.errorsMessages.push({
      message: "at least one resolution should be added",
      field: "availableResolutions",
    });
  }

  return errors;
};
