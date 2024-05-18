import { Response, Request, NextFunction } from "express";
import { authRepository } from "../repositories";

export const emailResendingValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await authRepository.getByLoginOrEmail(req.body.email);

  const generateError = (message: string, field: string) => ({
    errorsMessages: [{ message, field }],
  });

  if (!result) {
    return res.status(400).send(generateError("Email is not found", "email"));
  }

  if (result.emailConfirmation.isConfirmed === true) {
    return res
      .status(400)
      .send(generateError("Email is already confirmed", "email"));
  }

  next();
  return;
};
