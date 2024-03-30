import { APIErrorResult } from "../features/videos/input-output-types/output-errors-type";
import { Video } from "../features/videos/input-output-types/output-video-types";

export const updateValidation = (data: Video) => {
  let errors: APIErrorResult = {
    errorsMessages: [],
  };

  if (data.author && data.author.length > 40) {
    errors.errorsMessages.push({
      message: "max length 40 characters",
      field: "author",
    });
  }

   if (data.title && data.title.length > 40) {
     errors.errorsMessages.push({
       message: "max length 40 characters",
       field: "title",
     });
   }

  if (data.availableResolutions && data.availableResolutions.length === 0) {
    errors.errorsMessages.push({
      message: "at least one resolution should be added",
      field: "availableResolutions",
    });
  }

  if (
    data.minAgeRestriction &&
    (data.minAgeRestriction > 18 || data.minAgeRestriction < 1)
  ) {
    errors.errorsMessages.push({
      message: "the age restriction should be between 1 and 18",
      field: "minAgeRestriction",
    });
  }

  return errors;
};
