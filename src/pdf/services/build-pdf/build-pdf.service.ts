import { Injectable } from '@nestjs/common';
import { Page5Service } from './pages/page5.service';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { CleanDataDto } from 'src/pdf/dtos/cleanData.dto';

@Injectable()
export class BuildPdfService {
  constructor(private readonly page5Service: Page5Service) {}

  private addImageToPage(doc: PDFDocument, imagePath: string, page?: number) {
    if (page !== 1) doc.addPage();
    doc.image(imagePath, 0, 0, {
      width: 620,
      height: 842,
    });
  }
  private _transformToMap(data) {
    return data.reduce(function (map, obj) {
      map[obj.kompetenz] = obj;
      return map;
    }, {});
  }

  buildPdf(charts, cleanData: CleanDataDto) {
    const { radarChart } = charts;
    const { klient, stakeholder } = cleanData;
    const klientMap = this._transformToMap(klient);
    const stakeholderMap = this._transformToMap(stakeholder);
    const doc = new PDFDocument({ margin: 0, size: 'A4' });
    doc.fontSize(8);
    const filename = 'myDocument.pdf';
    const writeStream = fs.createWriteStream(filename);
    doc.pipe(writeStream);

    this.addImageToPage(
      doc,
      './src/pdf/services/build-pdf/pdf/de/page-01.png',
      1,
    );
    this.addImageToPage(doc, './src/pdf/services/build-pdf/pdf/de/page-02.png');
    this.addImageToPage(doc, './src/pdf/services/build-pdf/pdf/de/page-03.png');
    this.addImageToPage(doc, './src/pdf/services/build-pdf/pdf/de/page-04.png');

    // Add the pages to the document using the respective services
    this.page5Service.addContentToPage(
      doc,
      radarChart,
      klientMap,
      stakeholderMap,
    );

    // Finalize the PDF and end the stream
    doc.end();

    return doc;
  }
}
