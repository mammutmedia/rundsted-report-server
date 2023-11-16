import { PDFDocument } from 'pdfkit';
import { Injectable } from '@nestjs/common';
import { ChartUtilityService } from '../../create-charts/chart-utility.service';
import { Page7Service } from './page7.service';

@Injectable()
export class Page9Service {
  constructor(
    private readonly chartUtilityService: ChartUtilityService,
    private readonly page7Service: Page7Service,
  ) {}

  async addContentToPage(
    doc: PDFDocument,
    klientMap: CompetenceData,
    stakeholderMap: CompetenceData,
    lang,
    PDF_LOCATION,
  ) {
    doc.addPage().image(PDF_LOCATION, 0, 0, {
      width: 620,
      height: 842,
    });

    const COMPETENZ_1 = 'Ecosystem-Management';

    const ecoSystemManagementData = this.page7Service.extractChartData(
      klientMap[COMPETENZ_1].skills,
      stakeholderMap[COMPETENZ_1].skills,
      lang,
    );

    const chartEcosystemManagement =
      await this.chartUtilityService.createBarChart(
        ecoSystemManagementData.labels,
        ecoSystemManagementData.klientSkills,
        ecoSystemManagementData.stakeholderSkills,
      );
    doc.image(chartEcosystemManagement, 90, 250, { width: 450, height: 150 });
  }
}
