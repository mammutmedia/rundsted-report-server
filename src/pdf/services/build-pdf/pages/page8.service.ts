import { PDFDocument } from 'pdfkit';
import { Injectable } from '@nestjs/common';
import { ChartUtilityService } from '../../create-charts/chart-utility.service';

@Injectable()
export class Page8Service {
  constructor(private readonly chartUtilityService: ChartUtilityService) {}

  async addContentToPage(
    doc: PDFDocument,
    klientMap: CompetenceData,
    stakeholderMap: CompetenceData,
  ) {
    doc
      .addPage()
      .image('./src/pdf/services/build-pdf/pdf/de/page-08.png', 0, 0, {
        width: 620,
        height: 842,
      });

    const COMPETENZ_1 = 'Digital literacy';
    const COMPETENZ_2 = 'Enterprising mindset';

    const digitalLiteracyData = this.extractChartData(
      klientMap[COMPETENZ_1].skills,
      stakeholderMap[COMPETENZ_1].skills,
    );

    const enterprisingMindsetData = this.extractChartData(
      klientMap[COMPETENZ_2].skills,
      stakeholderMap[COMPETENZ_2].skills,
    );

    const chartDigitalLiteracy = await this.chartUtilityService.createBarChart(
      digitalLiteracyData.labels,
      digitalLiteracyData.klientSkills,
      digitalLiteracyData.stakeholderSkills,
    );

    const chartEnterprisingMindset =
      await this.chartUtilityService.createBarChart(
        enterprisingMindsetData.labels,
        enterprisingMindsetData.klientSkills,
        enterprisingMindsetData.stakeholderSkills,
      );

    doc.image(chartDigitalLiteracy, 90, 290, { width: 450, height: 150 });
    doc.image(chartEnterprisingMindset, 90, 570, { width: 450, height: 150 });
  }

  private extractChartData(klientSkills, stakeholderSkills) {
    const labels = Object.keys(klientSkills);
    const klientSkillsRating = Object.values(klientSkills);
    const stakeholderSkillsRating = Object.values(stakeholderSkills);

    return {
      labels,
      klientSkills: klientSkillsRating,
      stakeholderSkills: stakeholderSkillsRating,
    };
  }
}
