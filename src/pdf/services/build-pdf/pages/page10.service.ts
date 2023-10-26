import { PDFDocument } from 'pdfkit';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Page10Service {
  async addContentToPage(
    doc: PDFDocument,
    klientMap: CompetenceData,
    stakeholderMap: CompetenceData,
  ) {
    doc
      .addPage()
      .image('./src/pdf/services/build-pdf/pdf/de/page-10.png', 0, 0, {
        width: 620,
        height: 842,
      });

    /* extract skills as a list with [{skill: rating}, ...] */
    const { sortedSkillsKlient, sortedSkillsStake } = this.extractData(
      klientMap,
      stakeholderMap,
    );

    let yPos = 285;
    const LINE_HEIGHT = 15;
    const X_POS_KLIENT = 62;
    const X_POS_STAKEHOLDER = 306;
    const RATING_DISTANCE = 130;
    doc.fontSize(9);
    doc.fillColor('#696969');

    for (let i = 0; i < sortedSkillsKlient.length; i++) {
      const { skill: klientSkill, rating: klientRating } =
        sortedSkillsKlient[i];
      const { skill: stakeSkill, rating: stakeRating } = sortedSkillsStake[i];
      doc.text(klientSkill, X_POS_KLIENT, yPos);
      doc.text(klientRating, X_POS_KLIENT + RATING_DISTANCE, yPos);
      /* stakeholder column */
      doc.text(stakeSkill, X_POS_STAKEHOLDER, yPos);
      doc.text(stakeRating, X_POS_STAKEHOLDER + RATING_DISTANCE, yPos);
      yPos += LINE_HEIGHT;
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
    /* returns [ { skill: 'Digital excitement', rating: 2 },...] */
    return Object.entries(data).flatMap(([competence, { skills }]) =>
      Object.entries(skills).map(([skill, rating]) => ({ skill, rating })),
    );
  }
}
