import { PDFDocument } from 'pdfkit';
import { Inject, Injectable } from '@nestjs/common';
import { ChartFactory } from '../../create-charts/chart.factory';
import { ChartOptions } from 'chart.js';
import { PageService } from '../page.interface';

@Injectable()
export class Page5Service {
  constructor(
    @Inject('RadarChartFactory') private radarChartFactory: ChartFactory,
  ) {}
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

    const radarChart = await this.createRadarChart(klientMap, stakeholderMap);
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

  private createRadarChart(klientMap, stakeholderMap) {
    const radarChartData = {
      labels: ['', '', '', '', ''],
      datasets: [
        {
          label: 'Klient/in',
          data: [
            klientMap['Problem solving'].averageRating,
            klientMap['Learning Agility'].averageRating,
            klientMap['Digital literacy'].averageRating,
            klientMap['Ecosystem-Management'].averageRating,
            klientMap['Enterprising mindset'].averageRating,
          ],
          borderColor: ['rgb(231, 68, 60)'],
          backgroundColor: ['rgba(231, 68, 60, 0)'],
        },
        {
          label: 'Stakeholder',
          data: [
            stakeholderMap['Problem solving'].averageRating,
            stakeholderMap['Learning Agility'].averageRating,
            stakeholderMap['Digital literacy'].averageRating,
            stakeholderMap['Ecosystem-Management'].averageRating,
            stakeholderMap['Enterprising mindset'].averageRating,
          ],
          borderColor: ['rgb(87, 87, 87)'],
          backgroundColor: ['rgba(0, 0, 0, 0.1)'],
        },
      ],
    };
    const radarChartOptions: ChartOptions = {
      devicePixelRatio: 1,
      scales: {
        r: {
          angleLines: {
            display: false,
          },
          suggestedMin: 0,
          suggestedMax: 5,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };
    return this.radarChartFactory.createChart(
      radarChartData,
      radarChartOptions,
    );
  }
}
