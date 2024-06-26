export type NewPasswordRecoveryInputModel = {
  /**
   * newPassword (required field, maxLength: 20, minLength: 6)
   * recoveryCode (required field), string
   */
  newPassword: string;
  recoveryCode: string;
};
