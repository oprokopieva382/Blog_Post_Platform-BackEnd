import { Response, Request, NextFunction } from "express";
import { authRepository } from "../repositories";

export const tokensValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await authRepository.getByLoginOrEmail(req.body.email);
  // if (!result) {
  //   next();
  //   return;
  // }

  // const error = {
  //   errorsMessages: [
  //     {
  //       message: "User already exists",
  //       field: "email",
  //     },
  //   ],
  // };
  //return res.status(400).send(error);
};
