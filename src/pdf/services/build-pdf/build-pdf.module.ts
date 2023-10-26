// build-pdf.module.ts
import { Module } from '@nestjs/common';
import { Page5Service } from './pages/page5.service';
import { Page6Service } from './pages/page6.service';
import { BuildPdfService } from './build-pdf.service';
import { ChartModule } from '../create-charts/create-charts.module'; // Import ChartModule
import { Page7Service } from './pages/page7.service';
import { Page8Service } from './pages/page8.service';
import { Page9Service } from './pages/page9.service';
import { Page10Service } from './pages/page10.service';
import { Page11Service } from './pages/page11.service';
import { Page12Service } from './pages/page12.service';

@Module({
  providers: [
    Page5Service,
    Page6Service,
    Page7Service,
    Page8Service,
    Page9Service,
    Page10Service,
    Page11Service,
    Page12Service,
    BuildPdfService,
  ],
  exports: [BuildPdfService],
  imports: [ChartModule],
})
export class BuildPdfModule {}
