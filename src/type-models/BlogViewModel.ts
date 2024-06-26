export type BlogViewModel = {
  /**
   * Blog id (required field)
   * Blog name (required field)
   * Blog description (required field)
   * Blog websiteUrl (required field)
   * Blog createdAt (string date time)
   * Blog isMembership (boolean, 	boolean, true if user has not expired membership subscription to blog)
   */
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt?: string;
  isMembership?: boolean;
};
