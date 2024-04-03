import { PostInputModel } from "../models/PostInputModel";
import { APIErrorResult } from "../output-errors-type";

export const validation = (data: PostInputModel) => {
  let errors: APIErrorResult = {
    errorsMessages: [],
  };

  return errors;
};
