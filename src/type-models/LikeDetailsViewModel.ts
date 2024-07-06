export type LikeDetailsViewModel = {
  /**
   * Post liked userId (optional field & string)
   * Post liked login (optional field & string)
   * Post liked description (optional field & string)
   * Post liked addedAt (optional field & Date)
   */
  userId?: string;
  login?: string;
  description?: string;
  addedAt?: Date;
};
