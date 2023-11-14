import { Page8Service } from './pages/page8.service';
import { Page7Service } from './pages/page7.service';
import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { CleanDataDto } from 'src/pdf/dtos/cleanData.dto';
import { Page5Service } from './pages/page5.service';
import { Page6Service } from './pages/page6.service';
import { Page9Service } from './pages/page9.service';
import { Page10Service } from './pages/page10.service';
import { Page11Service } from './pages/page11.service';
import { Page12Service } from './pages/page12.service';

@Injectable()
export class BuildPdfService {
  constructor(
    private readonly page5Service: Page5Service,
    private readonly page6Service: Page6Service,
    private readonly page7Service: Page7Service,
    private readonly page8Service: Page8Service,
    private readonly page9Service: Page9Service,
    private readonly page10Service: Page10Service,
    private readonly page11Service: Page11Service,
    private readonly page12Service: Page12Service,
  ) {}

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

  async buildPdf(cleanData: CleanDataDto) {
    const { klient, stakeholder } = cleanData;
    const klientMap = this._transformToMap(klient);
    const stakeholderMap = this._transformToMap(stakeholder);
    const doc = new PDFDocument({ margin: 0, size: 'A4' });
    doc.fontSize(9);

    const filename = `report-${new Date().valueOf()}.pdf`;
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
    await this.page5Service.addContentToPage(doc, klientMap, stakeholderMap);
    await this.page6Service.addContentToPage(doc, klientMap, stakeholderMap);
    await this.page7Service.addContentToPage(doc, klientMap, stakeholderMap);
    await this.page8Service.addContentToPage(doc, klientMap, stakeholderMap);
    await this.page9Service.addContentToPage(doc, klientMap, stakeholderMap);
    await this.page10Service.addContentToPage(doc, klientMap, stakeholderMap);
    await this.page11Service.addContentToPage(doc, klientMap, stakeholderMap);
    await this.page12Service.addContentToPage(doc, klientMap, stakeholderMap);

    // Finalize the PDF and end the stream
    doc.end();

    return filename;
  }
}
