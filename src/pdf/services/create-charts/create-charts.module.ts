import { Module } from '@nestjs/common';
import {
  BarChartStrategy,
  ChartFactory,
  DoughnutChartStrategy,
  LineChartStrategy,
  RadarChartStrategy,
} from './chart.factory';

@Module({
  providers: [
    {
      provide: 'BarChartFactory',
      useFactory: () => {
        return new ChartFactory(new BarChartStrategy());
      },
    },
    {
      provide: 'LineChartFactory',
      useFactory: () => {
        return new ChartFactory(new LineChartStrategy());
      },
    },
    {
      provide: 'RadarChartFactory',
      useFactory: () => {
        return new ChartFactory(new RadarChartStrategy());
      },
    },
    {
      provide: 'DoughnutChartFactory',
      useFactory: () => {
        return new ChartFactory(new DoughnutChartStrategy());
      },
    },
  ],
  exports: [
    'BarChartFactory',
    'LineChartFactory',
    'RadarChartFactory',
    'DoughnutChartFactory',
  ] /* needed because it allows the providers to be used in other modules that import the current module */,
})
export class ChartModule {}
