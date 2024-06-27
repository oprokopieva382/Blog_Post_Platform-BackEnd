import { Types } from "mongoose";

export class BlogDBType {
  constructor(
    public _id: Types.ObjectId,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt?: string,
    public isMembership?: boolean
  ) {}
}

export class PostDBType {
  constructor(
    public _id: Types.ObjectId,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: Types.ObjectId,
    public blogName: string,
    public createdAt?: string
  ) {}
}

export class UserDBType {
  constructor(
    public _id: Types.ObjectId,
    public login: string,
    public password: string,
    public email: string,
    public createdAt: string,
    public emailConfirmation: ConfirmationEmailType
  ) {}
}

type ConfirmationEmailType = {
  confirmationCode: string;
  expirationDate: ExpirationDate;
  isConfirmed: boolean;
};

// export type UserDBType = {
//   _id: Types.ObjectId;
//   login: string;
//   password: string;
//   email: string;
//   createdAt: string;
//   emailConfirmation: ConfirmationEmailType;
// };



type ExpirationDate = Date;

export type CommentDBType = {
  _id: Types.ObjectId;
  postId: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
};

export type SessionsDBType = {
  _id: Types.ObjectId;
  userId: string;
  deviceId: string;
  iat: string;
  deviceName: string;
  ip: string;
  exp: string;
};

export type ApiDBType = {
  IP: string;
  URL: string;
  date: Date;
};

export type PasswordRecoveryDBType = {
  _id: Types.ObjectId;
  recoveryCode: string;
  email: string;
  expirationDate: Date;
  createdAt: string;
};
