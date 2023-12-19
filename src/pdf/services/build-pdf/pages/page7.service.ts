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
    lang: Language,
    PDF_LOCATION: string,
  ) {
    doc.addPage().image(PDF_LOCATION, 0, 0, {
      width: 620,
      height: 842,
    });

    const COMPETENZ_1 = 'Problem solving';
    const COMPETENZ_2 = 'Learning Agility';

    const problemSolvingData = this.extractChartData(
      klientMap[COMPETENZ_1].skills,
      stakeholderMap[COMPETENZ_1].skills,
      lang,
    );

    const learningAgilityData = this.extractChartData(
      klientMap[COMPETENZ_2].skills,
      stakeholderMap[COMPETENZ_2].skills,
      lang,
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

  extractChartData(klientSkills, stakeholderSkills, lang) {
    // sort to guarantee the same order in chart
    const sortedKlientSkills = this.sortObjectByKey(klientSkills);
    const sortedStakeholderSkills = this.sortObjectByKey(stakeholderSkills);
    const labels = this.extractSkillNamesByLanguage(sortedKlientSkills, lang);
    const klientSkillsRating = Object.values(sortedKlientSkills).map(
      // @ts-ignore
      (data) => data.rating,
    );
    const stakeholderSkillsRating = Object.values(sortedStakeholderSkills).map(
      // @ts-ignore
      (data) => data.rating,
    );
    return {
      labels,
      klientSkills: klientSkillsRating,
      stakeholderSkills: stakeholderSkillsRating,
    };
  }

  private sortObjectByKey(skillObj) {
    return Object.fromEntries(
      Object.entries(skillObj).sort(([a], [b]) => a.localeCompare(b)),
    );
  }
  private extractSkillNamesByLanguage(skillObject, language) {
    return Object.values(skillObject)
      .map((data) => data[language])
      .filter((name) => name !== null);
  }
}
