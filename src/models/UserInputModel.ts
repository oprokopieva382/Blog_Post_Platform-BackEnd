export type UserInputModel = {
  /**
   * login (required field, maxLength: 10, minLength: 3, only with pattern: ^[a-zA-Z0-9_-]*$)
   * password (required field, maxLength: 20, minLength: 6)
   * email (required field), only with pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
   */
  login: string;
  password: string;
  email: string;
};
