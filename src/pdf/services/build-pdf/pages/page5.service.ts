import { PDFDocument } from 'pdfkit';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Page5Service {
  addContentToPage(doc: PDFDocument) {
    doc
      .addPage()
      .image('./src/pdf/services/build-pdf/pdf/de/page-05.png', 0, 0, {
        width: 620,
        height: 842,
      });
    doc.text('Page 1 content', 100, 100);
  }
}
