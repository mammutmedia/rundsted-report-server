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
    doc
      .addPage()
      .image('./src/pdf/services/build-pdf/pdf/de/page-09.png', 0, 0, {
        width: 620,
        height: 842,
      });

    const COMPETENZ_1 = 'Ecosystem-Management';

    const ecoSystemManagementData = this.extractChartData(
      klientMap[COMPETENZ_1].skills,
      stakeholderMap[COMPETENZ_1].skills,
    );

    const chartEcosystemManagement =
      await this.chartUtilityService.createBarChart(
        ecoSystemManagementData.labels,
        ecoSystemManagementData.klientSkills,
        ecoSystemManagementData.stakeholderSkills,
      );
    doc.image(chartEcosystemManagement, 90, 250, { width: 450, height: 150 });
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
