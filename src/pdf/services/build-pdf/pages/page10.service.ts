import { PDFDocument } from 'pdfkit';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Page10Service {
  private readonly PAGE_WIDTH = 620;
  private readonly PAGE_HEIGHT = 842;
  private readonly LINE_HEIGHT = 15;

  private readonly X_POS_KLIENT = 62;
  private readonly X_POS_STAKEHOLDER = 306;
  private readonly RATING_DISTANCE = 130;

  async addContentToPage(
    doc: PDFDocument,
    klientMap: CompetenceData,
    stakeholderMap: CompetenceData,
    language: Language,
    PDF_LOCATION: string,
  ) {
    doc.addPage().image(PDF_LOCATION, 0, 0, {
      width: this.PAGE_WIDTH,
      height: this.PAGE_HEIGHT,
    });

    const { sortedSkillsKlient, sortedSkillsStake } = this.extractData(
      klientMap,
      stakeholderMap,
      language,
    );

    let yPos = 285;
    doc.fontSize(9);
    doc.fillColor('#696969');
    for (let i = 0; i < sortedSkillsKlient.length; i++) {
      const { skill: klientSkill, rating: klientRating } =
        sortedSkillsKlient[i];
      const { skill: stakeSkill, rating: stakeRating } = sortedSkillsStake[i];

      this.renderSkillRatingPair(
        doc,
        klientSkill,
        klientRating,
        this.X_POS_KLIENT,
        yPos,
      );
      this.renderSkillRatingPair(
        doc,
        stakeSkill,
        stakeRating,
        this.X_POS_STAKEHOLDER,
        yPos,
      );

      yPos += this.LINE_HEIGHT;
    }
  }

  private extractData(klientMap, stakeholderMap, language: Language) {
    const klientSkillRatingPairs = this.extractSkillRatingPairs(
      klientMap,
      language,
    );
    const stakeholderSkillRatingPairs = this.extractSkillRatingPairs(
      stakeholderMap,
      language,
    );
    const sortedSkillsKlient = this.sort(klientSkillRatingPairs);
    const sortedSkillsStake = this.sort(stakeholderSkillRatingPairs);

    return { sortedSkillsKlient, sortedSkillsStake };
  }

  private sort(data) {
    return data.sort((a, b) => b.rating - a.rating);
  }

  extractSkillRatingPairs(data: CompetenceData, language: Language) {
    const skillRatingArray = [];

    for (const competencyKey in data) {
      const competency = data[competencyKey];

      for (const skillKey in competency.skills) {
        const skill = competency.skills[skillKey];
        const skillName = skill[language];
        const rating = skill.rating;

        skillRatingArray.push({ skill: skillName, rating });
      }
    }

    return skillRatingArray;
  }

  private renderSkillRatingPair(
    doc: PDFDocument,
    skill: string,
    rating: number,
    xPos: number,
    yPos: number,
  ) {
    doc.text(skill, xPos, yPos);
    doc.text(rating.toString(), xPos + this.RATING_DISTANCE, yPos);
  }
}
