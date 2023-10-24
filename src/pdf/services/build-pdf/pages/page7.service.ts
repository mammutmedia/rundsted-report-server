import { PDFDocument } from 'pdfkit';
import { Injectable } from '@nestjs/common';
import { ChartUtilityService } from '../../create-charts/chart-utility.service';

@Injectable()
export class Page7Service {
  constructor(private readonly chartUtilityService: ChartUtilityService) {}

  async addContentToPage(
    doc: PDFDocument,
    klientMap: CompetenceData,
    stakeholderMap: CompetenceData,
  ) {
    doc
      .addPage()
      .image('./src/pdf/services/build-pdf/pdf/de/page-07.png', 0, 0, {
        width: 620,
        height: 842,
      });

    const COMPETENZ_1 = 'Problem solving';
    const COMPETENZ_2 = 'Learning Agility';

    const problemSolvingData = this.extractChartData(
      klientMap[COMPETENZ_1].skills,
      stakeholderMap[COMPETENZ_1].skills,
    );

    const learningAgilityData = this.extractChartData(
      klientMap[COMPETENZ_2].skills,
      stakeholderMap[COMPETENZ_2].skills,
    );

    const chartProblemSolving = await this.chartUtilityService.createBarChart(
      problemSolvingData.labels,
      problemSolvingData.klientSkills,
      problemSolvingData.stakeholderSkills,
    );

    const chartLearningAgility = await this.chartUtilityService.createBarChart(
      learningAgilityData.labels,
      learningAgilityData.klientSkills,
      learningAgilityData.stakeholderSkills,
    );

    doc.image(chartProblemSolving, 90, 290, { width: 450, height: 150 });
    doc.image(chartLearningAgility, 90, 570, { width: 450, height: 150 });
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
