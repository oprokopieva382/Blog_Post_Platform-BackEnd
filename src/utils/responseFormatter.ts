import { Response } from "express";

export type FieldError = {
  message: string;
  field: string;
};

export type ResponseDataType<T extends object> = {
  status: number;
  data: T | {};
  message?: string;
  errorsMessages?: FieldError[];
};

export const formatResponse = <T extends object>(
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

  //best and more common response in real practice
  //return res.status(status).json(responseObject);

  //Incubator response option (for learning purpose only)
  return Object.keys(responseObject.data).length === 0
    ? res.status(status).json({ errorsMessages: responseObject.errorsMessages })
    : res.status(status).json(responseObject.data);
};
