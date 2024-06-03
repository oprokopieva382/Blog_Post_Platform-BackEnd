export class ApiError extends Error {
  status: number;
  errorsMessages: any[];

  constructor(status: number, message: string, errorsMessages: any[] = []) {
    super(message);
    this.status = status;
    this.errorsMessages = errorsMessages;
  }

  static UnauthorizedError(message: string, errorsMessages: any[] = []) {
    return new ApiError(401, message, errorsMessages);
  }

  static BadRequestError(message: string, errorsMessages: any[] = []) {
    return new ApiError(400, message, errorsMessages);
  }

  static NotFoundError(message: string, errorsMessages: any[] = []) {
    return new ApiError(404, message, errorsMessages);
  }

  static ForbiddenError(message: string, errorsMessages: any[] = []) {
    return new ApiError(403, message, errorsMessages);
  }
}
