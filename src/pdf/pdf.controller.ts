import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PdfService } from './pdf.service';
import { CreateReportDto } from './dtos/createPdf.dto';

@Controller('pdf')
export class PdfController {
  constructor(private pdfService: PdfService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createPdf(@Body() data: CreateReportDto) {
    this.pdfService.createPdf(data);
    return 'This action returns the pdf URL';
  }
}
