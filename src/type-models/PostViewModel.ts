import { ExtendedLikesInfoViewModel } from ".";

export type PostViewModel = {
  /**
   * Post id (required field)
   * Post title (required field)
   * Post shortDescription (required field)
   * Post content (required field)
   * Post to blogId joint (required field)
   * Post to blogName joint (required field)
   * Post createdAt (date-time string)
   * Post extendedLikesInfo (required & ref to ExtendedLikesInfoViewModel)
   */
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt?: string;
  extendedLikesInfo: ExtendedLikesInfoViewModel;
};
