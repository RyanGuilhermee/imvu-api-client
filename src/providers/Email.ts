import nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';

export class Email {
  public static sendEmail(mailOptions: Options): void {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
      }
    });

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
  }
}
