import nodemailer from "nodemailer";
import { SETTINGS } from "../settings";

export class EmailService  {
  async sendEmail(email: string, code: string) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SETTINGS.REGISTRATION_EMAIL,
        pass: SETTINGS.REGISTRATION_PASS,
      },
    });

    const emailInfo = transporter.sendMail({
      from: `"BlogPosts Registration" <${SETTINGS.REGISTRATION_EMAIL}>`,
      to: email,
      subject: "Email confirmation",
      html: `
        <h1>Thank you for your registration</h1>
        <p>To finish registration please follow the link below:
        <a href="https://google.com/confirm-email?code=${code}">complete registration</a></p>
      `,
    });

    return !!emailInfo;
  }
  
  async passwordRecovery(email: string, code: string) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SETTINGS.REGISTRATION_EMAIL,
        pass: SETTINGS.REGISTRATION_PASS,
      },
    });

    const emailInfo = transporter.sendMail({
      from: `"BlogPosts Password Recovery" <${SETTINGS.REGISTRATION_EMAIL}>`,
      to: email,
      subject: "Password recovery",
      html: `
        <h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
        <a href="https://google.com/password-recovery?recoveryCode=${code}">This link will expire in one hour.</a></p>
      `,
    });

    return !!emailInfo;
  }
};
