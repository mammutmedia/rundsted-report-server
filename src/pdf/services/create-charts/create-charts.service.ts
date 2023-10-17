import { Inject, Injectable } from '@nestjs/common';
import { CleanDataDto } from 'src/pdf/dtos/cleanData.dto';
import { ChartFactory } from './chart.factory';
import { ChartOptions } from 'chart.js';

@Injectable()
export class CreateChartsService {
  constructor(
    @Inject('BarChartFactory')
    private barChartFactory: ChartFactory,
    @Inject('LineChartFactory')
    private lineChartFactory: ChartFactory,
    @Inject('RadarChartFactory') private radarChartFactory: ChartFactory,
  ) {}

  async createCharts(data: CleanDataDto) {
    console.log(data);
    const radarChart = await this.createRadarChart(data);

    return { radarChart: radarChart };
  }

  private createRadarChart(data) {
    const { klient, stakeholder } = data;
    const klientMap = this.transformToMap(klient);
    const stakeholderMap = this.transformToMap(stakeholder);

    console.log(klientMap, stakeholderMap);
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
          borderColor: ['rgb(231, 68, 60)'],
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
          borderColor: ['rgb(87, 87, 87)'],
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

  private transformToMap(data) {
    return data.reduce(function (map, obj) {
      map[obj.kompetenz] = obj;
      return map;
    }, {});
  }
}
