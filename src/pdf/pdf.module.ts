import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { S3Service } from './services/s3/s3.service';
import { BuildPdfService } from './services/build-pdf/build-pdf.service';
import { CreateChartsService } from './services/create-charts/create-charts.service';
import { CleanDataService } from './services/clean-data/clean-data.service';
import { PdfService } from './pdf.service';
import { ChartModule } from './services/create-charts/create-charts.module';
import { Page5Service } from './services/build-pdf/pages/page5.service';

@Module({
  controllers: [PdfController],
  providers: [
    PdfService,
    CleanDataService,
    CreateChartsService,
    BuildPdfService,
    S3Service,
    Page5Service,
  ],
  imports: [ChartModule],
})
export class PdfModule {}
