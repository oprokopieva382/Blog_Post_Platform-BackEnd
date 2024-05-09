import { Response, Request, NextFunction } from "express";
import { authRepository } from "../repositories";

export const validationUserLoginUnique = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await authRepository.getByLoginOrEmail(req.body.login);
  console.log(result);
  if (!result) {
    next();
    return;
  }

  const error = {
    errorsMessages: [
      {
        message: "User already exists",
        field: "login",
      },
    ],
  };
  return res.status(400).send(error);
};
