import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as AWS from 'aws-sdk';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
    AWS.config.update({
      accessKeyId,
      secretAccessKey,
      region: 'eu-west-1',
    });
  }

  async sendMail(email: string, report: string) {
    this.transporter = nodemailer.createTransport({
      SES: new AWS.SES({
        apiVersion: '2010-12-01',
      }),
    });
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
