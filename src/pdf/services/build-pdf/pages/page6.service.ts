import { PDFDocument } from 'pdfkit';
import { Inject, Injectable } from '@nestjs/common';
import { PageService } from '../page.interface';
import { ChartFactory } from '../../create-charts/chart.factory';
import { ChartOptions } from 'chart.js';
import { ChartUtilityService } from '../../create-charts/chart-utility.service';

@Injectable()
export class Page6Service {
  constructor(private readonly chartUtilityService: ChartUtilityService) {}
  async addContentToPage(
    doc: PDFDocument,
    klientMap: CompetenceData,
    stakeholderMap: CompetenceData,
  ) {
    doc
      .addPage()
      .image('./src/pdf/services/build-pdf/pdf/de/page-06.png', 0, 0, {
        width: 620,
        height: 842,
      });

    const barChart = await this.chartUtilityService.createBarChartE4FIndex(
      klientMap,
      stakeholderMap,
    );
    doc.image(barChart, 50, 655, { width: 425, height: 60 });

    this.enrichMapWithPercentage(klientMap);
    this.enrichMapWithPercentage(stakeholderMap);

    console.log(klientMap);

    let yPos = 235;
    const LINE_HEIGHT = 15;
    const X_POS_RATING = 330;
    const X_POS_PERCENTAGE = 370;
    const X_POS_DELTA = 420;
    for (const key of Object.keys(klientMap)) {
      const { averageRating, percentage } = klientMap[key];
      const delta = 100 - percentage;
      doc.text(averageRating, X_POS_RATING, yPos);
      doc.text(percentage, X_POS_PERCENTAGE, yPos);
      doc.text(delta, X_POS_DELTA, yPos);
      yPos += LINE_HEIGHT;
    }

    const doughnut = await this.createDoughnutCharts(klientMap);
    this.addDoughnutCharts(doc, doughnut, klientMap);

    return;
  }

  private addDoughnutCharts(
    doc: PDFDocument,
    doughnut: Record<string, any>,
    klientMap: CompetenceData,
  ) {
    const Y_POS_FIRST_ROW = 340;
    const INITIAL_FIRST_ROW_X_POS = 63;
    const FIRST_MARGIN_BETWEEN_DOUGHNUTS = 200;
    const firstRowCompetences = [
      'Problem solving',
      'Learning Agility',
      'Digital literacy',
    ];

    this.addDoughnutChartsAndScores(
      doc,
      INITIAL_FIRST_ROW_X_POS,
      Y_POS_FIRST_ROW,
      FIRST_MARGIN_BETWEEN_DOUGHNUTS,
      firstRowCompetences,
      doughnut,
      klientMap,
    );

    const Y_POS_SECOND_ROW = 430;
    const INITIAL_SECOND_ROW_X_POS = 150;
    const SECOND_MARGIN_BETWEEN_DOUGHNUTS = 220;
    const secondRowCompetences = [
      'Ecosystem-Management',
      'Enterprising mindset',
    ];

    this.addDoughnutChartsAndScores(
      doc,
      INITIAL_SECOND_ROW_X_POS,
      Y_POS_SECOND_ROW,
      SECOND_MARGIN_BETWEEN_DOUGHNUTS,
      secondRowCompetences,
      doughnut,
      klientMap,
    );
  }

  private addDoughnutChartsAndScores(
    doc: PDFDocument,
    xPos: number,
    Y_POS: number,
    MARGIN_BETWEEN_DOUGHNUTS: number,
    competences: string[],
    doughnut: Record<string, Buffer>, // Assuming doughnut is a dictionary of Buffers
    klientMap: CompetenceData,
  ) {
    for (let i = 0; i < competences.length; i++) {
      const competence = competences[i];

      // Add the doughnut chart
      doc.image(
        doughnut[competence],
        xPos + i * MARGIN_BETWEEN_DOUGHNUTS,
        Y_POS,
        {
          width: 50,
        },
      );

      // Add the percentage score
      doc.text(
        klientMap[competence].percentage + '%',
        xPos + i * MARGIN_BETWEEN_DOUGHNUTS + 17,
        Y_POS + 22,
      );
    }
  }

  private async createDoughnutCharts(klientCompetenceMap: CompetenceData) {
    const doughnutObject: Record<string, any> = {};

    await Promise.all(
      Object.entries(klientCompetenceMap).map(
        async ([competence, competenceData]) => {
          const doughnut = await this.chartUtilityService.createDoughnutChart(
            competenceData.percentage,
          );
          doughnutObject[competence] = doughnut;
        },
      ),
    );

    return doughnutObject;
  }

  private enrichMapWithPercentage(map: CompetenceData) {
    for (const competenceData of Object.values(map)) {
      competenceData.percentage = parseFloat(
        (competenceData.averageRating / 0.05).toFixed(2),
      );
    }
  }
}
