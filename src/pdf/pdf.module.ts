import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { S3Service } from './services/s3/s3.service';
import { CreateChartsService } from './services/create-charts/create-charts.service';
import { CleanDataService } from './services/clean-data/clean-data.service';
import { PdfService } from './pdf.service';
import { ChartModule } from './services/create-charts/create-charts.module';
import { BuildPdfModule } from './services/build-pdf/build-pdf.module';

@Module({
  controllers: [PdfController],
  providers: [PdfService, CleanDataService, CreateChartsService, S3Service],
  imports: [ChartModule, BuildPdfModule],
})
export class PdfModule {}
