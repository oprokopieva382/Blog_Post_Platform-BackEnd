import { LikeStatus } from "../types/LikesStatus";

export type LikeInputModel = {
  /**
   * Comment likeStatus (required field, string of None, Like, Dislike)
   */
  likeStatus: LikeStatus;
};
