import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as AWS from 'aws-sdk';
const AdmZip = require('adm-zip');
const fs = require('fs');
import * as zlib from 'zlib';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
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
    try {
      const pdfStream = fs.createReadStream(report);
      const compressedStream = pdfStream.pipe(zlib.createGzip());

      // Convert the compressed stream to a buffer
      const compressedData = await new Promise((resolve, reject) => {
        const chunks = [];
        compressedStream.on('data', (chunk) => chunks.push(chunk));
        compressedStream.on('end', () => resolve(Buffer.concat(chunks)));
        compressedStream.on('error', reject);
      });

      const REPORT_FILENAME = 'report.pdf.gz';
      const ZIP_FILENAME = 'report.zip';
      const zip = new AdmZip();
      zip.addFile(REPORT_FILENAME, compressedData, '', 0o644);
      const zipBuffer = zip.toBuffer();

      const EMAIL_FROM = 'no-reply@newcareer.ch';
      const mailOptions = {
        from: EMAIL_FROM,
        to: email,
        subject: 'Your Report',
        text: 'Here is your report',
        attachments: [
          {
            filename: ZIP_FILENAME,
            content: zipBuffer, // SES max size is 10MB, so we need to zip the file
          },
        ],
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully: ', info.response);
    } catch (error) {
      console.error('Unable to send mail: ', error);
      throw error;
    }
  }
}
