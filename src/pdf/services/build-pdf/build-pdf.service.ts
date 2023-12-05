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
import { Page1Service } from './pages/page1.service';

@Injectable()
export class BuildPdfService {
  constructor(
    private readonly page1Service: Page1Service,
    private readonly page5Service: Page5Service,
    private readonly page6Service: Page6Service,
    private readonly page7Service: Page7Service,
    private readonly page8Service: Page8Service,
    private readonly page9Service: Page9Service,
    private readonly page10Service: Page10Service,
    private readonly page11Service: Page11Service,
    private readonly page12Service: Page12Service,
  ) {}

  private addImageToPage(doc: PDFDocument, imagePath: string) {
    doc.addPage();
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

  async buildPdf(cleanData: CleanDataDto, lang: Language, name: string) {
    const { klient, stakeholder } = cleanData;
    const klientMap = this._transformToMap(klient);
    const stakeholderMap = this._transformToMap(stakeholder);
    const doc = new PDFDocument({ margin: 0, size: 'A4' });
    const PDF_LOCATION = `./src/pdf/services/build-pdf/pdf/${lang}/`;

    const filename = `report-${new Date().valueOf()}.pdf`;
    const writeStream = fs.createWriteStream(filename);
    doc.pipe(writeStream);

    await this.page1Service.addContentToPage(
      doc,
      name,
      `${PDF_LOCATION}page-01.png`,
    );
    doc.fontSize(9);
    this.addImageToPage(doc, `${PDF_LOCATION}page-02.png`);
    this.addImageToPage(doc, `${PDF_LOCATION}page-03.png`);
    this.addImageToPage(doc, `${PDF_LOCATION}page-04.png`);

    // Add the pages to the document using the respective services
    await this.page5Service.addContentToPage(
      doc,
      klientMap,
      stakeholderMap,
      `${PDF_LOCATION}page-05.png`,
    );
    await this.page6Service.addContentToPage(
      doc,
      klientMap,
      stakeholderMap,
      lang,
      `${PDF_LOCATION}page-06.png`,
    );
    await this.page7Service.addContentToPage(
      doc,
      klientMap,
      stakeholderMap,
      lang,
      `${PDF_LOCATION}page-07.png`,
    );
    await this.page8Service.addContentToPage(
      doc,
      klientMap,
      stakeholderMap,
      lang,
      `${PDF_LOCATION}page-08.png`,
    );
    await this.page9Service.addContentToPage(
      doc,
      klientMap,
      stakeholderMap,
      lang,
      `${PDF_LOCATION}page-09.png`,
    );
    await this.page10Service.addContentToPage(
      doc,
      klientMap,
      stakeholderMap,
      lang,
      `${PDF_LOCATION}page-10.png`,
    );
    await this.page11Service.addContentToPage(
      doc,
      klientMap,
      stakeholderMap,
      lang,
      `${PDF_LOCATION}page-11.png`,
    );
    await this.page12Service.addContentToPage(
      doc,
      klientMap,
      lang,
      `${PDF_LOCATION}page-12.png`,
    );

    // Finalize the PDF and end the stream
    doc.end();

    return filename;
  }
}
