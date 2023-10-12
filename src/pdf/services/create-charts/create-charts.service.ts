import { Inject, Injectable } from '@nestjs/common';
import { CleanDataDto } from 'src/pdf/dtos/cleanData.dto';
import { ChartFactory } from './chart.factory';

@Injectable()
export class CreateChartsService {
  constructor(
    @Inject('BarChartFactory')
    private barChartFactory: ChartFactory,
    @Inject('LineChartFactory')
    private lineChartFactory: ChartFactory,
  ) {}

  async createCharts(data: CleanDataDto) {
    // Sample data for a line chart
    const lineChartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Revenue',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          lineTension: 0.1,
        },
      ],
    };
    const lineChart = await this.lineChartFactory.createChart(lineChartData);
    // Sample data for a bar chart
    const barChartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          data: [65, 59, 80, 81, 56, 55, 40],
          label: 'Revenue',
          backgroundColor: 'rgb(75, 192, 192)',
        },
      ],
    };
    const barChart = this.barChartFactory.createChart(barChartData);

    return;
  }
}
