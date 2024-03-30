export type APIErrorResult = {
  errorsMessages: FieldError[];
};

type FieldError = {
  message: string;
  field: string;
};
