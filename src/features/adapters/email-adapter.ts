import nodemailer from "nodemailer";
import { SETTINGS } from "../../settings";

export const emailAdapter = {
  async sendEmail(email: string, code: string) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SETTINGS.REGISTRATION_EMAIL,
        pass: SETTINGS.REGISTRATION_PASS,
      },
    });

    const emailInfo = await transporter.sendMail({
      from: `"BlogPosts Registration" <${SETTINGS.REGISTRATION_EMAIL}>`,
      to: email,
      subject: "Email confirmation",
      html: `<h1>Thank you for your registration</h1>
      <p>To finish registration, please follow the link below:</p>
      <p><a href="https://stackoverflow.com/confirm-email?code=${code}">Complete registration</a></p>`,
    });

    return !!emailInfo;
  },
};
