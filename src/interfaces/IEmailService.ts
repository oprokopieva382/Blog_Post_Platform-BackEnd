export interface IEmailService {
  sendEmail(email: string, link: string): Promise<boolean>;
  passwordRecovery(email: string, link: string): Promise<boolean>;
}
