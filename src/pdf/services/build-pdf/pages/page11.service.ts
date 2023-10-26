import { PDFDocument } from 'pdfkit';
import { Injectable } from '@nestjs/common';
import { Page10Service } from './page10.service'; // Assuming this is the correct import path

@Injectable()
export class Page11Service {
  constructor(private readonly page10Service: Page10Service) {}

  private readonly PAGE_IMAGE =
    './src/pdf/services/build-pdf/pdf/de/page-11.png';
  private readonly PAGE_WIDTH = 620;
  private readonly PAGE_HEIGHT = 842;
  private readonly LINE_HEIGHT = 12;

  private readonly X_POS_HIDDEN = 82;
  private readonly X_POS_BLIND = 348;
  private readonly RATING_DISTANCE = 130;

  addContentToPage(
    doc: PDFDocument,
    klientMap: CompetenceData,
    stakeholderMap: CompetenceData,
  ) {
    doc.addPage().image(this.PAGE_IMAGE, 0, 0, {
      width: this.PAGE_WIDTH,
      height: this.PAGE_HEIGHT,
    });

    const skillsKlient = this.sortSkills(
      this.page10Service.extractSkillRatingPairs(klientMap),
    );

    const skillsStakeholder = this.sortSkills(
      this.page10Service.extractSkillRatingPairs(stakeholderMap),
    );

    const { hiddenSelfSkills, blindSelfSkills } = this.extractHiddenBlindSkills(
      skillsKlient,
      skillsStakeholder,
    );

    this.renderSkills(doc, hiddenSelfSkills, this.X_POS_HIDDEN);
    this.renderSkills(doc, blindSelfSkills, this.X_POS_BLIND);

    const hiddenSelfText = this.textByLanguage('de', hiddenSelfSkills.length);
    const blindSelfText = this.textByLanguage('de', blindSelfSkills.length);

    this.renderCountText(doc, hiddenSelfText, 215);
    this.renderCountText(doc, blindSelfText, 370);
  }

  private sortSkills(skills) {
    return skills.sort(this.stringSort);
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

  private renderSkills(doc, skills, xPos) {
    let yPos = 480;

    for (let i = 0; i < skills.length; i++) {
      const { skill, difference } = skills[i];
      doc.fillColor('#696969');
      doc.text(skill, xPos, yPos);
      doc.text(difference, xPos + this.RATING_DISTANCE, yPos);
      yPos += this.LINE_HEIGHT;
    }
  }

  private renderCountText(doc, text, xPos) {
    doc.fontSize(7);
    doc.fillColor('#FFFFFF');
    doc.text(text, xPos, 335);
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
