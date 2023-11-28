// chart.utility.service.ts

import { Inject, Injectable } from '@nestjs/common';
import { ChartOptions } from 'chart.js';
import { ChartFactory } from './chart.factory';

@Injectable()
export class ChartUtilityService {
  readonly KLIENT_COLOR = 'rgb(56, 45, 115)';
  readonly STAKEHOLDER_COLOR = 'rgb(213, 69, 60)';

  constructor(
    @Inject('BarChartFactory') private barChartFactory: ChartFactory,
    @Inject('DoughnutChartFactory') private doughnutChartFactory: ChartFactory,
    @Inject('RadarChartFactory') private radarChartFactory: ChartFactory,
  ) {}

  createBarChart(labels: string[], klientSkills: any, stakeholderSkills: any) {
    const barChartData = {
      labels,
      datasets: [
        {
          label: 'Klient',
          data: klientSkills,
          barThickness: 30,
          backgroundColor: this.KLIENT_COLOR,
        },
        {
          label: 'Stakeholder',
          data: stakeholderSkills,
          barThickness: 30,
          backgroundColor: this.STAKEHOLDER_COLOR,
        },
      ],
    };
    const barChartOptions: ChartOptions = {
      /* categoryPercentage: 0.5, */
      /* barPercentage: 1, */
      responsive: true,
      indexAxis: 'y',
      scales: {
        y: {
          afterFit: function (scaleInstance) {
            scaleInstance.width = 500; // Sets width of Labels
          },
          ticks: {
            font: {
              size: 36,
            },
          },
        },
        x: {
          min: 1,
          max: 5,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };
    return this.barChartFactory.createChart(
      barChartData,
      barChartOptions,
      1500, //450, need to increase width and height to increase the quality of the image
      500, //170,
    );
  }

  createRadarChart(klientMap, stakeholderMap) {
    const radarChartData = {
      labels: ['', '', '', '', ''],
      datasets: [
        {
          label: 'Klient/in',
          data: [
            klientMap['Problem solving'].averageRating,
            klientMap['Learning Agility'].averageRating,
            klientMap['Digital literacy'].averageRating,
            klientMap['Ecosystem-Management'].averageRating,
            klientMap['Enterprising mindset'].averageRating,
          ],
          borderColor: this.KLIENT_COLOR,
          backgroundColor: ['rgba(231, 68, 60, 0)'],
        },
        {
          label: 'Stakeholder',
          data: [
            stakeholderMap['Problem solving'].averageRating,
            stakeholderMap['Learning Agility'].averageRating,
            stakeholderMap['Digital literacy'].averageRating,
            stakeholderMap['Ecosystem-Management'].averageRating,
            stakeholderMap['Enterprising mindset'].averageRating,
          ],
          borderColor: this.STAKEHOLDER_COLOR,
          backgroundColor: ['rgba(0, 0, 0, 0.1)'],
        },
      ],
    };
    const radarChartOptions: ChartOptions = {
      devicePixelRatio: 1,
      scales: {
        r: {
          angleLines: {
            display: false,
          },
          suggestedMin: 0,
          suggestedMax: 5,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };
    return this.radarChartFactory.createChart(
      radarChartData,
      radarChartOptions,
    );
  }

  createDoughnutChart(kompetenzPercentage) {
    const doughnutChartData = {
      labels: ['Red', 'Blue', 'Yellow'],
      borderWidth: 1,
      datasets: [
        {
          label: 'My First Dataset',
          data: [100 - kompetenzPercentage, kompetenzPercentage],
          backgroundColor: ['rgb(211,211,211)', this.KLIENT_COLOR],
        },
      ],
    };
    const doughnutChartOptions = {
      cutout: '70%',
      plugins: {
        legend: {
          display: false,
        },
      },
      elements: {
        center: {
          text: 'Red is 2/3 the total numbers',
          color: '#FF6384', // Default is #000000
          fontStyle: 'Arial', // Default is Arial
          sidePadding: 20, // Default is 20 (as a percentage)
          minFontSize: 20, // Default is 20 (in px), set to false and text will not wrap.
          lineHeight: 25, // Default is 25 (in px), used for when text wraps
        },
      },
    };
    return this.doughnutChartFactory.createChart(
      doughnutChartData,
      doughnutChartOptions,
    );
  }

  createBarChartE4FIndex(klientMap, stakeholderMap) {
    const klientAverage = this.calculateAverageOfAverages(klientMap);
    const stakeholderAverage = this.calculateAverageOfAverages(stakeholderMap);
    const barChartData = {
      labels: [''],
      datasets: [
        {
          label: [''],
          data: [klientAverage],
          backgroundColor: this.KLIENT_COLOR,
        },
        {
          label: [''],
          data: [stakeholderAverage],
          backgroundColor: this.STAKEHOLDER_COLOR,
        },
      ],
    };
    const barChartOptions: ChartOptions = {
      /* categoryPercentage: 0.5, */
      /* barPercentage: 1, */
      indexAxis: 'y',
      scales: {
        y: {
          ticks: {
            font: {
              size: 21,
            },
          },
        },
        x: {
          min: 1,
          max: 5,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    return this.barChartFactory.createChart(barChartData, barChartOptions);
  }

  private calculateAverageOfAverages(data: CompetenceData) {
    let totalAverage = 0;
    let numCompetences = 0;

    for (const competenceData of Object.values(data)) {
      totalAverage += competenceData.averageRating;
      numCompetences++;
    }

    const averageOfAverages = totalAverage / numCompetences;
    return averageOfAverages;
  }
}
