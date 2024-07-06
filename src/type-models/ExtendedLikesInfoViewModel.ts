import { LikeDetailsViewModel } from ".";
import { LikeStatus } from "../types/LikesStatus";

export type ExtendedLikesInfoViewModel = {
  /**
   * Post likesCount (optional field & number)
   * Post dislikesCount (optional field & number)
   * Post myStatus (optional field and enum None, Like, Dislike only)
   * Post newestLikes (optional field of latest liked post user information)
   */
  likesCount?: number;
  dislikesCount?: number;
  myStatus?: LikeStatus;
  newestLikes?: LikeDetailsViewModel[];
};
