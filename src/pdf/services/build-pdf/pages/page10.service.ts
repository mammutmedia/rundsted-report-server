import { PDFDocument } from 'pdfkit';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Page10Service {
  private readonly PAGE_IMAGE =
    './src/pdf/services/build-pdf/pdf/de/page-10.png';
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
  ) {
    doc.addPage().image(this.PAGE_IMAGE, 0, 0, {
      width: this.PAGE_WIDTH,
      height: this.PAGE_HEIGHT,
    });

    const { sortedSkillsKlient, sortedSkillsStake } = this.extractData(
      klientMap,
      stakeholderMap,
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

  private extractData(klientMap, stakeholderMap) {
    const klientSkillRatingPairs = this.extractSkillRatingPairs(klientMap);
    const stakeholderSkillRatingPairs =
      this.extractSkillRatingPairs(stakeholderMap);
    const sortedSkillsKlient = this.sort(klientSkillRatingPairs);
    const sortedSkillsStake = this.sort(stakeholderSkillRatingPairs);
    return { sortedSkillsKlient, sortedSkillsStake };
  }

  private sort(data) {
    return data.sort((a, b) => b.rating - a.rating);
  }

  extractSkillRatingPairs(data: CompetenceData) {
    return Object.entries(data).flatMap(([competence, { skills }]) =>
      Object.entries(skills).map(([skill, rating]) => ({ skill, rating })),
    );
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
