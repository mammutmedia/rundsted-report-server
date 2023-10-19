import { BuildPdfService } from './services/build-pdf/build-pdf.service';
import { CleanDataService } from './services/clean-data/clean-data.service';
import { Injectable } from '@nestjs/common';
import { S3Service } from './services/s3/s3.service';
import { CreateReportDto } from './dtos/createPdf.dto';
import { CleanDataDto } from './dtos/cleanData.dto';

@Injectable()
export class PdfService {
  constructor(
    private cleanDataService: CleanDataService,
    private buildPdfService: BuildPdfService,
    private s3Service: S3Service,
  ) {}
  async createPdf(data: CreateReportDto) {
    /* clean data Service */
    const cleanedData: CleanDataDto = this.cleanDataService.cleanData(data);
    /* create Charts Service */
    /* const charts = await this.createChartsService.createCharts(cleanedData); */
    /* Build PDf Service */
    const pdf = this.buildPdfService.buildPdf(cleanedData);
    /* Upload PDF to S3 Service */
    /* this.s3Service.uploadPdf(data); */
    return 'This action returns the pdf';
  }
}
