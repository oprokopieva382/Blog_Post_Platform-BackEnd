import { FieldError } from "../output-errors-type";

export class ApiError extends Error {
  status: number;
  errorsMessages: FieldError[];

  constructor(
    status: number,
    message: string,
    errorsMessages: FieldError[] = []
  ) {
    super(message);
    this.status = status;
    this.errorsMessages = errorsMessages;
  }

  static UnauthorizedError(message: string, errorsMessages: FieldError[] = []) {
    return new ApiError(401, message, errorsMessages);
  }

  static BadRequestError(message: string, errorsMessages: FieldError[] = []) {
    return new ApiError(400, message, errorsMessages);
  }

  static NotFoundError(message: string, errorsMessages: FieldError[] = []) {
    return new ApiError(404, message, errorsMessages);
  }
}
