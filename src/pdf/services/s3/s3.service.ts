import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class S3Service {
  uploadPdf(pdf: string) {
    return 'This action uploads the pdf to S3';
  }
}
