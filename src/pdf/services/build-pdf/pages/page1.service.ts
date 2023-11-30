import { PDFDocument } from 'pdfkit';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Page1Service {
  async addContentToPage(doc: PDFDocument, name: string, PDF_LOCATION: string) {
    doc.image(PDF_LOCATION, 0, 0, {
      width: 620,
      height: 842,
    });

    doc.fillColor('#ffffff');
    doc.fontSize(16);
    doc.font('Helvetica');
    doc.text(name, 35, 442);
    doc.font('Helvetica');
    return;
  }
}
