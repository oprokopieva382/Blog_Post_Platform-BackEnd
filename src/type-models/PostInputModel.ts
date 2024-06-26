export type PostInputModel = {
  /**
   * Post title (required field & maxLength: 30)
   * Post shortDescription (required field & maxLength: 100)
   * Post content (required field, maxLength: 1000)
   * Post to blogId joint (required field)
   */
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
 };
