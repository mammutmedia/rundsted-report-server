import { PDFDocument } from 'pdfkit';
import { Inject, Injectable } from '@nestjs/common';
import { PageService } from '../page.interface';
import { round } from 'lodash';
import { ChartUtilityService } from '../../create-charts/chart-utility.service';
import { round1Decimal } from '../../clean-data/helper';

@Injectable()
export class Page6Service {
  readonly KLIENT_COLOR = '#382d73';
  readonly STAKEHOLDER_COLOR = '#d5453c';
  readonly CLIENT_TRANSLATE = {
    de: 'KLIENT/IN',
    en: 'CLIENT',
    fr: 'VOUS',
    it: 'LEI',
  };

  readonly STAKEHOLDER_TRANSLATE = {
    de: 'STAKEHOLDER',
    en: 'STAKEHOLDER',
    fr: 'PAIRS',
    it: 'STAKEHOLDER',
  };

  constructor(private readonly chartUtilityService: ChartUtilityService) {}
  async addContentToPage(
    doc: PDFDocument,
    klientMap: CompetenceData,
    stakeholderMap: CompetenceData,
    lang,
    PDF_LOCATION: string,
  ) {
    doc.addPage().image(PDF_LOCATION, 0, 0, {
      width: 620,
      height: 842,
    });

    this.enrichMapWithPercentage(klientMap);
    this.enrichMapWithPercentage(stakeholderMap);

    let yPos = 218;
    const LINE_HEIGHT = 15;
    const X_POS_RATING = 330;
    const X_POS_PERCENTAGE = 370;
    const X_POS_DELTA = 420;

    const keyOrder = [
      'Problem solving',
      'Learning Agility',
      'Digital literacy',
      'Ecosystem-Management',
      'Enterprising mindset',
    ];

    for (const key of keyOrder) {
      const { averageRating, percentage } = klientMap[key];
      const delta = 100 - percentage;
      doc.text(averageRating.toFixed(1), X_POS_RATING, yPos);
      doc.text(percentage, X_POS_PERCENTAGE, yPos);
      doc.text(delta, X_POS_DELTA, yPos);
      yPos += LINE_HEIGHT;
    }

    const doughnut = await this.createDoughnutCharts(klientMap);
    this.addDoughnutCharts(doc, doughnut, klientMap);

    /*     const barChart = await this.chartUtilityService.createBarChartE4FIndex(
      klientMap,
      stakeholderMap,
    );
    doc.image(barChart, 50, 638, { width: 425, height: 60 }); */

    this.createBarChartE4FIndex(doc, klientMap, stakeholderMap, lang);

    return;
  }

  private createBarChartE4FIndex(doc, klientMap, stakeholderMap, lang) {
    const klientAverage = this.calculateAverageOfAverages(klientMap);
    const klientBarLength = this.calculateBarLength(klientAverage);
    const stakeholderAverage = this.calculateAverageOfAverages(stakeholderMap);
    const stakeholderBarLength = this.calculateBarLength(stakeholderAverage);
    doc.lineWidth(20);
    const X_START = 63;
    const Y_STAKEHOLDER = 642;
    const Y_KLIENT = 665;
    const X_END_STAKEHOLDER = X_START + stakeholderBarLength;
    const X_END_KLIENT = X_START + klientBarLength;

    // X_END_KLIENT - X_START = 470

    // line cap settings (x, y)
    doc
      .lineCap('butt')
      .moveTo(X_START, Y_STAKEHOLDER)
      .lineTo(X_END_STAKEHOLDER, Y_STAKEHOLDER)
      .fillAndStroke(this.STAKEHOLDER_COLOR, this.STAKEHOLDER_COLOR);

    doc
      .lineCap('butt')
      .moveTo(X_START, Y_KLIENT)
      .lineTo(X_END_KLIENT, Y_KLIENT)
      .fillAndStroke(this.KLIENT_COLOR, this.KLIENT_COLOR);

    const X_POS_LABEL_STAKEHOLDER = X_END_STAKEHOLDER - 50;
    const X_POS_LABEL_KLIENT = X_END_KLIENT - 25;
    const X_POS_SCORE_STAKEHOLDER = X_END_STAKEHOLDER + 10;
    const X_POS_SCORE_KLIENT = X_END_KLIENT + 10;

    doc.fillColor('#ffffff');
    doc.fontSize(6);
    doc.font('Helvetica-Bold');
    doc.text(this.STAKEHOLDER_TRANSLATE[lang], X_POS_LABEL_STAKEHOLDER, 640);
    doc.text(this.CLIENT_TRANSLATE[lang], X_POS_LABEL_KLIENT, 663);
    doc.fillColor('#696969');
    doc.text(
      round1Decimal(stakeholderAverage).toFixed(1),
      X_POS_SCORE_STAKEHOLDER,
      640,
    );
    doc.text(round1Decimal(klientAverage).toFixed(1), X_POS_SCORE_KLIENT, 663);
    doc.font('Helvetica');
  }

  private calculateBarLength(rating) {
    const rounded_rating = Number(round1Decimal(rating).toFixed(1));
    const faktor = 470 / 4;
    const auffuellung = Math.max(
      0,
      Math.min(470, (rounded_rating - 1) * faktor),
    );
    return auffuellung;
  }

  private addDoughnutCharts(
    doc: PDFDocument,
    doughnut: Record<string, any>,
    klientMap: CompetenceData,
  ) {
    const Y_POS_FIRST_ROW = 323;
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

    const Y_POS_SECOND_ROW = 413;
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

  private calculateAverageOfAverages(data: CompetenceData) {
    let totalAverage = 0;
    let numCompetences = 0;

    for (const competenceData of Object.values(data)) {
      totalAverage += competenceData.averageRating;
      numCompetences++;
    }

    const averageOfAverages = (totalAverage / numCompetences).toFixed(2);
    return round(averageOfAverages, 2);
  }
}
