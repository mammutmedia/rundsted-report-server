import { Module } from '@nestjs/common';
import {
  BarChartStrategy,
  ChartFactory,
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
  ],
  exports: [
    'BarChartFactory',
    'LineChartFactory',
    'RadarChartFactory',
  ] /* needed because it allows the providers to be used in other modules that import the current module */,
})
export class ChartModule {}
