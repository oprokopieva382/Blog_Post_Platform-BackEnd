import { NextFunction, Request, Response } from "express";
import { jwtService } from "../features/application";
import { usersQueryRepository } from "../query_repositories";
import { UserViewModel } from "../models";

interface CustomRequest extends Request {
  user: UserViewModel;
}

export const authUserMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers["authorization"] as string;

  if (!auth) {
    res.status(401).json({
      errorMessages: {
        message: "Auth credentials is incorrect",
      },
    });
    return;
  }

  const token = req.headers.authorization!.split(" ")[1];

  const userId = await jwtService.getUserIdByToken(token);
  if (!userId) {
    res.status(401).json({
      errorMessages: {
        message: "Auth credentials is incorrect",
      },
    });
    return;
  }

   
  const foundUser = await usersQueryRepository.getByIdUser(userId.toString());
  if (!foundUser) {
     res.status(401).json({
       errorMessages: {
         message: "Auth credentials is incorrect",
       },
     });
     return;
  } 
  req.user = foundUser;
  next();
};
