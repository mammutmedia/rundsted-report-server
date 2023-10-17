import { Injectable } from '@nestjs/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
/* import filesystem */
import * as fs from 'fs';

interface IChartStrategy {
  create(data: ChartData, options: ChartOptions): Promise<string>;
}

class BaseChartStrategy implements IChartStrategy {
  constructor(private type: string) {}

  async create(data: ChartData, options: ChartOptions): Promise<string> {
    const configuration: ChartConfiguration = {
      type: this.type as any,
      data,
      options,
    };

    const chartJSNodeCanvas = new ChartJSNodeCanvas({
      width: 800,
      height: 600,
      backgroundColour: '#ffffff',
    });

    const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
    const directory = './src/pdf/services/create-charts/test-images/';
    fs.writeFileSync(
      `${directory}chart${new Date().getMilliseconds().toString()}.png`,
      buffer,
    );
    return buffer.toString('base64');
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

export class ChartFactory {
  constructor(private strategy: IChartStrategy) {}

  async createChart(data: ChartData, options: ChartOptions): Promise<string> {
    return await this.strategy.create(data, options);
  }
}
