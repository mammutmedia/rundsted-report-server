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

    const chartProblemSolving = this.chartUtilityService.createBarChart(
      problemSolvingData.labels,
      problemSolvingData.klientSkills,
      problemSolvingData.stakeholderSkills,
    );

    const chartLearningAgility = this.chartUtilityService.createBarChart(
      learningAgilityData.labels,
      learningAgilityData.klientSkills,
      learningAgilityData.stakeholderSkills,
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
