import nodemailer from "nodemailer";
import { SETTINGS } from "../settings";

export class EmailService {
  private async sendEmail(to: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SETTINGS.REGISTRATION_EMAIL,
        pass: SETTINGS.REGISTRATION_PASS,
      },
    });

    const emailInfo = await transporter.sendMail({
      from: `"BlogPosts" <${SETTINGS.REGISTRATION_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent: ", emailInfo.response);
    return !!emailInfo;
  }

  async sendRegistrationEmail(email: string, code: string) {
    const subject = "Email confirmation";
    const html = `
      <h1>Thank you for your registration</h1>
      <p>To finish registration please follow the link below:
      <a href="https://google.com/confirm-email?code=${code}">complete registration</a></p>
    `;
    return this.sendEmail(email, subject, html);
  }

  async sendPasswordRecoveryEmail(email: string, code: string) {
    const subject = "Password recovery";
    const html = `
      <h1>Password recovery</h1>
      <p>To finish password recovery please follow the link below:
      <a href="https://google.com/password-recovery?recoveryCode=${code}">This link will expire in one hour.</a></p>
    `;
    return this.sendEmail(email, subject, html);
  }
}
