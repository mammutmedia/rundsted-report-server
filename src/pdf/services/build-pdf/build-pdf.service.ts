import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class BuildPdfService {
  buildPdf(charts: any) {
    Logger.log('This action returns the pdf');
    return 'This action returns the pdf';
  }
}
