import { BuildPdfService } from './services/build-pdf/build-pdf.service';
import { CreateChartsService } from './services/create-charts/create-charts.service';
import { CleanDataService } from './services/clean-data/clean-data.service';
import { Injectable } from '@nestjs/common';
import { S3Service } from './services/s3/s3.service';
import { CreateReportDto } from './dtos/createPdf.dto';
import { CleanDataDto } from './dtos/cleanData.dto';

@Injectable()
export class PdfService {
  constructor(
    private cleanDataService: CleanDataService,
    private createChartsService: CreateChartsService,
    private buildPdfService: BuildPdfService,
    private s3Service: S3Service,
  ) {}
  createPdf(data: CreateReportDto) {
    console.log('This action uploads the pdf to S3');
    /* clean data Service */
    const cleanedData: CleanDataDto = this.cleanDataService.cleanData(data);
    /* create Charts Service */
    const charts = this.createChartsService.createCharts(cleanedData);
    /* Build PDf Service */
    /* const pdf = this.buildPdfService.buildPdf(charts); */
    /* Upload PDF to S3 Service */
    /* this.s3Service.uploadPdf(data); */
    console.log(cleanedData);
    return 'This action returns the pdf';
  }
}
