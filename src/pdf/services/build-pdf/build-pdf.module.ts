// build-pdf.module.ts
import { Module } from '@nestjs/common';
import { Page5Service } from './pages/page5.service';
import { Page6Service } from './pages/page6.service';
import { BuildPdfService } from './build-pdf.service';
import { ChartModule } from '../create-charts/create-charts.module'; // Import ChartModule

@Module({
  providers: [Page5Service, Page6Service, BuildPdfService],
  exports: [BuildPdfService],
  imports: [ChartModule],
})
export class BuildPdfModule {}
