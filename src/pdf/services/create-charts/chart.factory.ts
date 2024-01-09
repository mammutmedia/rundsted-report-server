import { Injectable } from '@nestjs/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
/* import filesystem */
import * as fs from 'fs';

interface IChartStrategy {
  create(
    data: ChartData,
    options,
    width?: number,
    height?: number,
  ): Promise<Buffer>;
}

class BaseChartStrategy implements IChartStrategy {
  constructor(private type: string) {}

  async create(
    data: ChartData,
    options,
    width?: number,
    height?: number,
  ): Promise<Buffer> {
    const configuration: ChartConfiguration = {
      type: this.type as any,
      data,
      options,
    };

    const chartJSNodeCanvas = new ChartJSNodeCanvas({
      width: width ?? 500, //px
      height: height ?? 500, //px
      backgroundColour: 'transparent',
      chartCallback: (ChartJS: any) => {
        ChartJS.defaults.font.family = 'Lato-Light';
        ChartJS.defaults.font.size = 16;
      }
      /*  plugins: {
        requireLegacy: ['chartjs-plugin-datalabels'],
      }, */
    });
    chartJSNodeCanvas.registerFont('./assets/chartjsNodeCanvasFont/Lato-Light.ttf', { family: 'Lato-Light' })
    const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
    return buffer;
  }
}

export class BarChartStrategy extends BaseChartStrategy {
  constructor() {
    super('bar');
  }
}

export class LineChartStrategy extends BaseChartStrategy {
  constructor() {
    super('line');
  }
}
export class RadarChartStrategy extends BaseChartStrategy {
  constructor() {
    super('radar');
  }
}

export class DoughnutChartStrategy extends BaseChartStrategy {
  constructor() {
    super('doughnut');
  }
}

export class ChartFactory {
  constructor(private strategy: IChartStrategy) {}

  async createChart(
    data: ChartData,
    options,
    width?: number,
    height?: number,
  ): Promise<Buffer> {
    return await this.strategy.create(data, options, width, height);
  }
}
