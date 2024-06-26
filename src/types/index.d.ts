import { UserViewModel } from "../type-models/UserViewModel";
import { Request } from "express";
declare global {
  namespace Express {
    export interface Request {
      userId: string;
      deviceId: string;
      user: UserViewModel;
    }
  }
}
