import { ObjectId } from "mongodb";
import { Types } from "mongoose";

export type BlogDBType = {
  _id: Types.ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt?: string;
  isMembership?: boolean;
};

export type PostDBType = {
  _id: Types.ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: Types.ObjectId;
  blogName: string;
  createdAt?: string;
};

export type UserDBType = {
  _id: Types.ObjectId;
  login: string;
  password: string;
  email: string;
  createdAt: string;
  emailConfirmation: ConfirmationEmailType;
};

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
