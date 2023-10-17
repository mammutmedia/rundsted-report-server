import { Injectable } from '@nestjs/common';
import { Page5Service } from './pages/page5.service';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';

@Injectable()
export class BuildPdfService {
  constructor(private readonly page5Service: Page5Service) {}

  addImageToPage(doc: PDFDocument, imagePath: string) {
    doc.image(imagePath, 0, 0, {
      width: 620,
      height: 842,
    });
    doc.addPage();
  }

  buildPdf() {
    const doc = new PDFDocument({ margin: 0, size: 'A4' });
    const filename = 'myDocument.pdf';
    const writeStream = fs.createWriteStream(filename);
    doc.pipe(writeStream);

    this.addImageToPage(doc, './src/pdf/services/build-pdf/pdf/de/page-01.png');
    this.addImageToPage(doc, './src/pdf/services/build-pdf/pdf/de/page-02.png');
    this.addImageToPage(doc, './src/pdf/services/build-pdf/pdf/de/page-03.png');
    this.addImageToPage(doc, './src/pdf/services/build-pdf/pdf/de/page-04.png');

    // Add the pages to the document using the respective services
    this.page5Service.addContentToPage(doc);

    // Finalize the PDF and end the stream
    doc.end();

    return doc;
  }
}
