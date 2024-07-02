import { LikeStatus } from "../types/LikesStatus";

export type LikesInfoViewModel = {
  /**
   * Comment likesCount (required field & number)
   * Comment dislikesCount (required field & number)
   * Comment myStatus (required field, string of None, Like, Dislike)
   */
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};
