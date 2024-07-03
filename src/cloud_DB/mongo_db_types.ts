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

export class CommentDBType {
  constructor(
    public _id: Types.ObjectId,
    public postId: string,
    public content: string,
    public commentatorInfo: {
      userId: string;
      userLogin: string;
    },
    public createdAt: string,
    public myStatus: LikeStatus = LikeStatus.None,
    public likesInfo: {
      likesCount: number;
      dislikesCount: number;
    } = { likesCount: 0, dislikesCount: 0 }
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

export class ReactionDBType {
  constructor(
    public _id: Types.ObjectId,
    //public commentId: string,
    public user: UserDBType,
    public myStatus: LikeStatus,
    public createdAt: string,
    public comment: CommentDBType
  ) {}
}

export class ReactionCountDBType {
  constructor(
    public _id: Types.ObjectId,
    public commentId: string,
    public likesCount: Number,
    public dislikesCount: Number
  ) {}
}
