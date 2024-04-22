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
  email: string;
  createdAt: string;
};
