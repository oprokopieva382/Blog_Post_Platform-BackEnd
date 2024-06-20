import nodemailer from "nodemailer";
import { SETTINGS } from "../settings";
import { IEmailService } from "../interfaces/IEmailService";

export class EmailService implements  IEmailService {
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
};
