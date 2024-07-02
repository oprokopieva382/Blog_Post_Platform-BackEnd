import { CommentatorInfo } from "../features/posts";
import { LikesInfoViewModel } from "./LikesInfoViewModel";

export type CommentViewModel = {
  /**
   * Comment id (required field & string)
   * Comment content (required field & string)
   * Comment commentatorInfo (required field, and is object of CommentatorInfo with required fields of userId: string and userLogin: string;)
   * Comment createdAt (required field & string($date-time))
   * Comment likesInfo (optional and contains inside info about likesCount, dislikesCount,  myStatus)
   */
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  likesInfo: LikesInfoViewModel;
  createdAt: string;
};
