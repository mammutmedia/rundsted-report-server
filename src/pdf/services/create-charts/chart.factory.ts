import { Injectable } from '@nestjs/common';
import { ChartConfiguration } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
/* import filesystem */
import * as fs from 'fs';

interface IChartStrategy {
  create(data: ChartData): Promise<string>;
}

class BaseChartStrategy implements IChartStrategy {
  constructor(private type: string) {}

  async create(data: ChartData): Promise<string> {
    const configuration: ChartConfiguration = {
      type: this.type as any,
      data,
    };

    const chartJSNodeCanvas = new ChartJSNodeCanvas({
      width: 800, // Set the width to your desired value
      height: 600, // Set the height to your desired value
      backgroundColour: '#ffffff', // Set the background color if needed
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

export class ChartFactory {
  constructor(private strategy: IChartStrategy) {}

  async createChart(data: ChartData): Promise<string> {
    return await this.strategy.create(data);
  }
}
