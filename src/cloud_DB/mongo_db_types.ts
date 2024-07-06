import { Types } from "mongoose";
import { LikeStatus } from "../types/LikesStatus";

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

export class PostDBType {
  constructor(
    public _id: Types.ObjectId,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blog: BlogDBType,
    public likesCount: number,
    public dislikesCount: number,
    public reactionInfo: Types.ObjectId[],
    public createdAt: string,
  ) {}
}
export class CommentDBType {
  constructor(
    public _id: Types.ObjectId,
    public post: PostDBType,
    public content: string,
    public commentatorInfo: {
      userId: string;
      userLogin: string;
    },
    public createdAt: string,
    public likesCount: number,
    public dislikesCount: number,
    public status: Types.ObjectId[]
  ) {}
}
export class ReactionDBType {
  constructor(
    public _id: Types.ObjectId,
    public user: UserDBType,
    public createdAt: string
  ) {}
}
export class LikeDetailsDBType {
  constructor(
    public user?: Types.ObjectId,
    public description?: string,
    public addedAt?: Date
  ) {}
}

export class PostReactionDBType {
  constructor(
    public post?: Types.ObjectId,
    public myStatus?: LikeStatus,
    public latestReactions?: LikeDetailsDBType[]
  ) {}
}
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
