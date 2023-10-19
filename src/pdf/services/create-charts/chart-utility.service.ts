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
          borderColor: ['rgb(205, 104, 95)'],
          backgroundColor: ['rgb(205, 104, 95)'],
        },
        {
          label: 'Stakeholder',
          data: stakeholderSkills,
          borderColor: ['rgb(179, 175, 157)'],
          backgroundColor: ['rgb(179, 175, 157)'],
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
}
