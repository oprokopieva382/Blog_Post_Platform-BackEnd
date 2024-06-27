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

export class SessionsDBType {
  constructor(
    public _id: Types.ObjectId,
    public userId: string,
    public deviceId: string,
    public iat: string,
    public deviceName: string,
    public ip: string,
    public exp: string
  ) {}
}

export type ApiDBType = {
  IP: string;
  URL: string;
  date: Date;
};

export class PasswordRecoveryDBType {
  constructor(
    public _id: Types.ObjectId,
    public recoveryCode: string,
    public email: string,
    public expirationDate: Date,
    public createdAt: string
  ) {}
}

