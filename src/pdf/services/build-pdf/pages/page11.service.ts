import { Page10Service } from './page10.service';
/* 

20 Skills

Falls Klient == Stakeholder -> Egal 

SonstL

HiddenSelf -> Selbst besser als der Durchschnittstakeholder
Blind Self -> Stakeholder besser als Klient

*/

import { PDFDocument } from 'pdfkit';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Page11Service {
  constructor(private readonly page10Service: Page10Service) {}
  async addContentToPage(
    doc: PDFDocument,
    klientMap: CompetenceData,
    stakeholderMap: CompetenceData,
  ) {
    doc
      .addPage()
      .image('./src/pdf/services/build-pdf/pdf/de/page-11.png', 0, 0, {
        width: 620,
        height: 842,
      });

    /* extract skills as a list with [{skill: rating}, ...] */
    const skillsKlient = this.page10Service
      .extractSkillRatingPairs(klientMap)
      .sort(this.stringSort);
    const skillsStakeholder = this.page10Service
      .extractSkillRatingPairs(stakeholderMap)
      .sort(this.stringSort);

    const { hiddenSelfSkills, blindSelfSkills } = this.extractHiddenBlindSkills(
      skillsKlient,
      skillsStakeholder,
    );

    let yPos = 480;
    const LINE_HEIGHT = 12;
    const X_POS_HIDDEN = 82;
    const X_POS_BLIND = 348;
    const RATING_DISTANCE = 130;
    doc.fillColor('#696969');

    for (let i = 0; i < hiddenSelfSkills.length; i++) {
      const { skill, difference } = hiddenSelfSkills[i];
      doc.text(skill, X_POS_HIDDEN, yPos);
      doc.text(difference, X_POS_HIDDEN + RATING_DISTANCE, yPos);
      yPos += LINE_HEIGHT;
    }
    yPos = 480;

    for (let i = 0; i < blindSelfSkills.length; i++) {
      const { skill, difference } = blindSelfSkills[i];
      doc.text(skill, X_POS_BLIND, yPos);
      doc.text(difference, X_POS_BLIND + RATING_DISTANCE, yPos);
      yPos += LINE_HEIGHT;
    }

    const hiddenSelfText = this.textByLanguage('de', hiddenSelfSkills.length);
    const blindSelfText = this.textByLanguage('de', blindSelfSkills.length);

    const COUNT_TEXT_HEIGHT = 335;
    doc.fontSize(7);
    doc.fillColor('#FFFFFF');
    doc.text(hiddenSelfText, 215, COUNT_TEXT_HEIGHT);
    doc.text(blindSelfText, 370, COUNT_TEXT_HEIGHT);
  }

  private extractHiddenBlindSkills(skillsKlient, skillsStakeholder) {
    const hiddenSelfSkills = [];
    const blindSelfSkills = [];

    for (let i = 0; i < skillsKlient.length; i++) {
      const { skill: klientSkill, rating: klientRating } = skillsKlient[i];
      const { skill: stakeSkill, rating: stakeRating } = skillsStakeholder[i];

      if (klientRating === stakeRating) continue;

      const difference = Math.abs(klientRating - stakeRating);

      const skillObj = { skill: klientSkill, difference };

      if (klientRating > stakeRating) {
        hiddenSelfSkills.push(skillObj);
      } else {
        blindSelfSkills.push(skillObj);
      }
    }

    return {
      hiddenSelfSkills: this.sortByDifference(hiddenSelfSkills),
      blindSelfSkills: this.sortByDifference(blindSelfSkills),
    };
  }

  private stringSort(a: any, b: any) {
    return a.skill.localeCompare(b.skill);
  }

  private sortByDifference(data) {
    return data.sort((a, b) => b.difference - a.difference);
  }

  private textByLanguage(language: string, count: number) {
    const text = (count) => {
      return {
        de: `in ${count} Fällen`,
      };
    };

    return text(count)[language];
  }
}
