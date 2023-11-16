import { PDFDocument } from 'pdfkit';
import { Injectable } from '@nestjs/common';
import { Page10Service } from './page10.service'; // Assuming this is the correct import path

@Injectable()
export class Page11Service {
  constructor(private readonly page10Service: Page10Service) {}

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
    language: Language,
    PDF_LOCATION: string,
  ) {
    doc.addPage().image(PDF_LOCATION, 0, 0, {
      width: this.PAGE_WIDTH,
      height: this.PAGE_HEIGHT,
    });

    const skillsKlient = this.sortSkills(
      this.page10Service.extractSkillRatingPairs(klientMap, language),
    );

    const skillsStakeholder = this.sortSkills(
      this.page10Service.extractSkillRatingPairs(stakeholderMap, language),
    );

    const { hiddenSelfSkills, blindSelfSkills } = this.extractHiddenBlindSkills(
      skillsKlient,
      skillsStakeholder,
    );

    this.renderSkills(doc, hiddenSelfSkills, this.X_POS_HIDDEN);
    this.renderSkills(doc, blindSelfSkills, this.X_POS_BLIND);

    const hiddenSelfText = this.textByLanguage(
      language,
      hiddenSelfSkills.length,
    );
    const blindSelfText = this.textByLanguage(language, blindSelfSkills.length);

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

      const difference = parseFloat(
        Math.abs(klientRating - stakeRating).toFixed(2),
      );

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
        en: `in ${count} cases`,
        fr: `dans ${count} cas`,
        it: `in ${count} casi`,
      };
    };

    return text(count)[language];
  }
}
