// chart.utility.service.ts

import { Inject, Injectable } from '@nestjs/common';
import { ChartOptions } from 'chart.js';
import { ChartFactory } from './chart.factory';

@Injectable()
export class ChartUtilityService {
  constructor(
    @Inject('BarChartFactory') private barChartFactory: ChartFactory,
  ) {}

  createBarChart(labels: string[], klientSkills: any, stakeholderSkills: any) {
    const barChartData = {
      labels,
      datasets: [
        {
          label: 'Klient',
          data: klientSkills,
          barThickness: 30,
          backgroundColor: ['rgb(56, 45, 115)'],
        },
        {
          label: 'Stakeholder',
          data: stakeholderSkills,
          barThickness: 30,
          backgroundColor: ['rgb(213, 69, 60)'],
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
            scaleInstance.width = 400; // sets the width to 100px
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
}
