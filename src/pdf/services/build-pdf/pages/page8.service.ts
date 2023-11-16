import { PDFDocument } from 'pdfkit';
import { Injectable } from '@nestjs/common';
import { ChartUtilityService } from '../../create-charts/chart-utility.service';
import { Page7Service } from './page7.service';

@Injectable()
export class Page8Service {
  constructor(
    private readonly chartUtilityService: ChartUtilityService,
    private readonly page7Service: Page7Service,
  ) {}

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

    const COMPETENZ_1 = 'Digital literacy';
    const COMPETENZ_2 = 'Enterprising mindset';

    const digitalLiteracyData = this.page7Service.extractChartData(
      klientMap[COMPETENZ_1].skills,
      stakeholderMap[COMPETENZ_1].skills,
      lang,
    );

    const enterprisingMindsetData = this.page7Service.extractChartData(
      klientMap[COMPETENZ_2].skills,
      stakeholderMap[COMPETENZ_2].skills,
      lang,
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
}
