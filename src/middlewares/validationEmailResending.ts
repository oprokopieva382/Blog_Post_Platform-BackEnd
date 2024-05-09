import { Response, Request, NextFunction } from "express";
import { authRepository } from "../repositories";

export const validationEmailResending = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await authRepository.getByLoginOrEmail(req.body.email);
  if (!result) {
    next();
    return;
  }
  const error = {
    errorsMessages: [
      {
        message: "Email is already confirmed",
        field: "email",
      },
    ],
  };

  if (result.emailConfirmation.isConfirmed === true) {
    return res.status(400).send(error);
  }

  return;
};
