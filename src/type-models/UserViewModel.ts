export type UserViewModel = {
  /**
   * id (required field)
   * login (required field)
   * email (required field)
   * password (field in date-time format)
   */
  id: string;
  login: string;
  email: string;
  createdAt: string;
};
