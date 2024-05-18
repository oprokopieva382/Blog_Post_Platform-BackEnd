import { Response, Request, NextFunction } from "express";
import { authRepository } from "../repositories";

export const emailConfirmationValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await authRepository.getByConfirmationCode(req.body.code);

  const generateError = (message: string, field: string) => ({
    errorsMessages: [{ message, field }],
  });

  if (!result) {
    return res.status(400).send(generateError("Code is incorrect", "code"));
  }

  if (result.emailConfirmation.isConfirmed === true) {
    return res
      .status(400)
      .send(generateError("Code is already confirmed", "code"));
  }

  if (result.emailConfirmation.expirationDate < new Date()) {
    return res
      .status(400)
      .send(generateError("Code is already expired", "code"));
  }

  next();
  return;
};
