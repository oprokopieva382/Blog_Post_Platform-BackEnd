import { Response } from "express";

export type FieldError = {
  message: string;
  field: string;
};

type ResponseDataType<T> = {
  status: number;
  data: T | {};
  message?: string;
  errorsMessages?: FieldError[];
};

export const formatResponse = <T>(
  res: Response,
  status: number,
  data: T | {},
  message: string,
  errorsMessages: FieldError[] = []
): Response<ResponseDataType<T>> => {
  const responseObject: ResponseDataType<T> = {
    status,
    data,
    message,
    errorsMessages,
  };
  return res.status(status).json(responseObject);
};

export type APIErrorResult = {
  errorsMessages: FieldError[];
};
