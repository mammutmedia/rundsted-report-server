import { PDFDocument } from 'pdfkit';
import { Injectable } from '@nestjs/common';
import { ChartUtilityService } from '../../create-charts/chart-utility.service';

@Injectable()
export class Page9Service {
  constructor(private readonly chartUtilityService: ChartUtilityService) {}

  async addContentToPage(
    doc: PDFDocument,
    klientMap: CompetenceData,
    stakeholderMap: CompetenceData,
  ) {
    const COMPETENZ_1 = 'Digital literacy';

    const DigitalLiteracyData = this.extractChartData(
      klientMap[COMPETENZ_1].skills,
      stakeholderMap[COMPETENZ_1].skills,
    );

    const chartDigitalLiteracy = this.chartUtilityService.createBarChart(
      DigitalLiteracyData.labels,
      DigitalLiteracyData.klientSkills,
      DigitalLiteracyData.stakeholderSkills,
    );
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
