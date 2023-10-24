import { PDFDocument } from 'pdfkit';
import { Inject, Injectable } from '@nestjs/common';
import { ChartFactory } from '../../create-charts/chart.factory';
import { ChartOptions } from 'chart.js';
import { PageService } from '../page.interface';
import { ChartUtilityService } from '../../create-charts/chart-utility.service';

@Injectable()
export class Page5Service {
  constructor(private readonly chartUtilityService: ChartUtilityService) {}
  async addContentToPage(
    doc: PDFDocument,
    klientMap: CompetenceData,
    stakeholderMap: CompetenceData,
  ) {
    doc
      .addPage()
      .image('./src/pdf/services/build-pdf/pdf/de/page-05.png', 0, 0, {
        width: 620,
        height: 842,
      });

    const radarChart = await this.chartUtilityService.createRadarChart(
      klientMap,
      stakeholderMap,
    );
    doc.image(radarChart, 150, 375, { width: 290 });

    let yPos = 235;
    const LINE_HEIGHT = 15;
    const X_POS_KLIENT = 330;
    const X_POS_STAKEHOLDER = 380;
    for (const key of Object.keys(klientMap)) {
      /* klient column */
      doc.text(klientMap[key].averageRating, X_POS_KLIENT, yPos);
      /* stakeholder column */
      doc.text(stakeholderMap[key].averageRating, X_POS_STAKEHOLDER, yPos);
      yPos += LINE_HEIGHT;
    }
  }
}
