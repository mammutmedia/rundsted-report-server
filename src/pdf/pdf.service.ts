import { MailService } from './services/mail/mail.service';
import { BuildPdfService } from './services/build-pdf/build-pdf.service';
import { CleanDataService } from './services/clean-data/clean-data.service';
import { Injectable } from '@nestjs/common';
import { S3Service } from './services/s3/s3.service';
import { CreateReportDto } from './dtos/createPdf.dto';
import { CleanDataDto } from './dtos/cleanData.dto';
/* fs */
import * as fs from 'fs';

@Injectable()
export class PdfService {
  constructor(
    private cleanDataService: CleanDataService,
    private buildPdfService: BuildPdfService,
    private mailService: MailService,
  ) {}
  async createPdf(data: CreateReportDto) {
    /* clean data Service */
    const { language, email, name } = data;

    console.log(name);

    const cleanedData: CleanDataDto = this.cleanDataService.cleanData(data);
    /* Build PDf Service */
    const filename = await this.buildPdfService.buildPdf(
      cleanedData,
      language,
      name,
    );
    await this.mailService.sendMail(email, filename);
    /* Upload PDF to S3 Service */
    /* this.s3Service.uploadPdf(data); */
    fs.unlink(filename, (err) => {
      if (err) {
        console.error('Failed to delete the report file: ', err);
      } else {
        console.log('Report file deleted successfully');
      }
    });
    return 'This action returns the pdf';
  }
}
