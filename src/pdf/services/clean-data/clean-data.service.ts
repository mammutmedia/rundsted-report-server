import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { KompetenzDto } from 'src/pdf/dtos/kompetenz.dto';
import { round } from 'lodash';
import { CreateReportDto } from 'src/pdf/dtos/createPdf.dto';

@Injectable()
export class CleanDataService {
  cleanData(data: CreateReportDto) {
    const { klient, stakeholder } = data;

    const kompetenzMapKlient: KompetenzDto[] = this.extractKlientData(klient);

    /* Merge all Stakeholder together by calculating the average */
    const universalStakeholder: KompetenzDto[] =
      this.createUniversalStakeholder(stakeholder);

    return {
      klient: kompetenzMapKlient,
      stakeholder: universalStakeholder,
    };
  }

  private createUniversalStakeholder(stakeholder: any) {
    const cleanedStakeholders = stakeholder.map((s) =>
      this.extractKlientData(s),
    );
    const numberStakeholder = cleanedStakeholders.length;

    const universalStakeholder = cleanedStakeholders.reduce((acc, curr) => {
      /* durch alle stakeholder durchloopen */

      curr.forEach(({ kompetenz, skills }) => {
        /* Loope über alle kompetenzen des stakeholders */
        if (!acc[kompetenz]) {
          acc[kompetenz] = {
            averageRating: 0,
            skills: {},
          };
        }
        Object.entries(skills).forEach(([skillName, rating]) => {
          if (!acc[kompetenz].skills[skillName]) {
            acc[kompetenz].skills[skillName] = 0;
          }

          /* Bilde den AverageStakeholder */
          const alignedSkillRating = Number(rating) / numberStakeholder;
          acc[kompetenz].skills[skillName] = round(
            acc[kompetenz].skills[skillName] +
              Number(rating) / numberStakeholder,
            1,
          );

          const alignedSkillRatingForAverage = alignedSkillRating / 5;
          acc[kompetenz].averageRating = round(
            acc[kompetenz].averageRating + alignedSkillRatingForAverage,
            1,
          );
        });
      });
      return acc;
    }, {});

    const arrayOfObjects: KompetenzDto[] =
      this.createArrayOfObjects(universalStakeholder);

    return arrayOfObjects;
  }

  private extractKlientData(klient: any) {
    const KompetenzMapKlient = klient.ergebnis.reduce((acc, curr) => {
      const kompetenzName = curr.frage.skill.kompetenz.name;
      const rating = curr.rating;
      const skillName = curr.frage.skill.name;

      if (!acc[kompetenzName]) {
        acc[kompetenzName] = {
          sum: 0,
          skills: {},
        };
      }
      acc[kompetenzName].skills[skillName] = rating;
      acc[kompetenzName].sum += rating;

      return acc;
    }, {});

    Object.keys(KompetenzMapKlient).forEach((key) => {
      const { skills, sum } = KompetenzMapKlient[key];
      const averageRating = sum / Object.keys(skills).length;
      KompetenzMapKlient[key].averageRating = averageRating;
    });

    const arrayOfObjects: KompetenzDto[] =
      this.createArrayOfObjects(KompetenzMapKlient);

    return arrayOfObjects;
  }

  private createArrayOfObjects(kompetenzMap: any) {
    const arrayOfObjects: KompetenzDto[] = Object.entries(kompetenzMap).map(
      ([kompetenz, details]) => {
        return {
          kompetenz,
          ...(details as KompetenzDto),
        };
      },
    );
    return arrayOfObjects;
  }
}
