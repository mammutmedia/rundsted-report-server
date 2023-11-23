import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { S3Service } from './services/s3/s3.service';
import { CleanDataService } from './services/clean-data/clean-data.service';
import { PdfService } from './pdf.service';
import { ChartModule } from './services/create-charts/create-charts.module';
import { BuildPdfModule } from './services/build-pdf/build-pdf.module';
import { MailService } from './services/mail/mail.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PdfController],
  providers: [PdfService, CleanDataService, S3Service, MailService],
  imports: [ChartModule, BuildPdfModule, ConfigModule.forRoot()],
})
export class PdfModule {}
