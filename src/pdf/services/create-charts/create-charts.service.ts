import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { CleanDataDto } from 'src/pdf/dtos/cleanData.dto';
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
import * as fs from 'fs';

@Injectable()
export class CreateChartsService {
  async createCharts(data: CleanDataDto) {
    const width = 400; //px
    const height = 400; //px
    const backgroundColour = 'white'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
    const chartJSNodeCanvas = new ChartJSNodeCanvas({});

    console.log(chartJSNodeCanvas);
    return 'This action returns the pdf';
  }
}
