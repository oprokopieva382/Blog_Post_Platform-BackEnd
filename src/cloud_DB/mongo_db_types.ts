import { ObjectId } from "mongodb";

export type BlogDBType = {
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt?: string;
  isMembership?: boolean;
};

export type PostDBType = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string;
  createdAt?: string;
};

export type UserDBType = {
  _id: ObjectId;
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
  _id: ObjectId;
  postId: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
};

export type BlackListTokenDBType = {
  //_id: ObjectId;
  refreshToken: string;
};

export type SessionsDBType = {
  _id: ObjectId;
  user_id: string;
  device_id: string;
  iat: string;
  device_name: string;
  ip: string;
  expiration: string;
};
