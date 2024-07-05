import { LikeStatus } from "../types/LikesStatus";

export type ExtendedLikesInfoViewModel = {
  /**
   * Post likesCount (required field & number)
   * Post dislikesCount (required field & number)
   * Post myStatus (required field and enum None, Like, Dislike only)
   */
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};
