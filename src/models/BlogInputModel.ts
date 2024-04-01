export type BlogInputModel = {
  /**
   * Blog name (required field & maxLength: 15)
   * Blog description (required field & maxLength: 500)
   * Blog websiteUrl (required field, maxLength: 100 & pattern: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$)
   */
  name: string;
  description: string;
  websiteUrl: string;
};
