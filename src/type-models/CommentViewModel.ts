import { CommentatorInfo } from "../features/posts";

export type CommentViewModel = {
  /**
   * Comment id (required field & string)
   * Comment content (required field & string)
   * Comment commentatorInfo (required field, and is object of CommentatorInfo with required fields of userId: string and userLogin: string;)
   * Comment createdAt (required field & string($date-time))
   */
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
};


