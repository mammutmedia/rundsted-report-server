import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
  region: 'eu-west-1',
});

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      SES: new AWS.SES({
        apiVersion: '2010-12-01',
      }),
    });
  }

  async sendMail(email: string, report: string) {
    const mailOptions = {
      from: 'no-reply@newcareer.ch',
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
