import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'grayce.bosco@ethereal.email',
        pass: 'TVAWg9ShQnGRzxgTvJ',
      },
    });
  }

  async sendMail(email: string, report: string) {
    const mailOptions = {
      from: 'grayce.bosco@ethereal.email',
      to: email,
      subject: 'Your Report',
      text: 'Here is your report',
      attachments: [
        {
          filename: 'report.pdf',
          path: report,
        },
      ],
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully: ', info.response);
    } catch (error) {
      console.error('Unable to send mail: ', error);
    }
  }
}
