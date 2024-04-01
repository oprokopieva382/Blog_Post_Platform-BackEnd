import { APIErrorResult } from "../features/videos/input-output-types/output-errors-type";
import {
  Resolutions,
  Video,
} from "../features/videos/input-output-types/output-video-types";

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

   if (!data.title) {
     errors.errorsMessages.push({
       message: "title field is required",
       field: "title",
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
  data.minAgeRestriction !== null &&
  typeof data.minAgeRestriction !== "number"
) {
  errors.errorsMessages.push({
    message:
      "min age restriction field should be a number or null if no age restriction",
    field: "minAgeRestriction",
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

  if (data.publicationDate && typeof data.publicationDate !== "string") {
    errors.errorsMessages.push({
      message: "publication date must be string type",
      field: "publicationDate",
    });
  }

  if (data.author && typeof data.author !== "string") {
    errors.errorsMessages.push({
      message: "author field must be string type",
      field: "author",
    });
  }

   if (data.canBeDownloaded && typeof data.canBeDownloaded !== "boolean") {
     errors.errorsMessages.push({
       message: "can be downloaded field must be boolean type",
       field: "canBeDownloaded",
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


   if (data.publicationDate && typeof data.publicationDate !== "string") {
     errors.errorsMessages.push({
       message: "publication date field must be string type",
       field: "publicationDate",
     });
   }

  if (data.publicationDate) {
    const isoRegex =
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/;
    const publicationDateTest = isoRegex.test(data.publicationDate);
    if (!publicationDateTest) {
      errors.errorsMessages.push({
        message: "publication date is not in right date time string format",
        field: "publicationDate",
      });
    }
  }

  return errors;
};
