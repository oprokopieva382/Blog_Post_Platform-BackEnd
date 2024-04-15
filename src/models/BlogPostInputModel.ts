export type BlogPostInputModel = {
  /**
   * Post title (required field & maxLength: 30)
   * Post shortDescription (required field & maxLength: 100)
   * Post content (required field, maxLength: 1000)
   */
  title: string;
  shortDescription: string;
  content: string;
};
