import { PDFDocument } from 'pdfkit';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Page5Service {
  addContentToPage(
    doc: PDFDocument,
    radarChart,
    klientMap: CompetenceData,
    stakeholderMap: CompetenceData,
  ) {
    doc
      .addPage()
      .image('./src/pdf/services/build-pdf/pdf/de/page-05.png', 0, 0, {
        width: 620,
        height: 842,
      })
      .image(radarChart, 150, 375, { width: 290 });

    let yPos = 235;
    const LINE_HEIGHT = 15;
    const X_POS_KLIENT = 330;
    const X_POS_STAKEHOLDER = 380;
    for (const key of Object.keys(klientMap)) {
      /* klient column */
      doc.text(klientMap[key].averageRating, X_POS_KLIENT, yPos);
      /* stakeholder column */
      doc.text(stakeholderMap[key].averageRating, X_POS_STAKEHOLDER, yPos);
      yPos += LINE_HEIGHT;
    }

    /* 
      klientMap['Problem solving'].averageRating,
      klientMap['Learning Agility'].averageRating,
      klientMap['Digital literacy'].averageRating,
      klientMap['Ecosystem-Management'].averageRating,
      klientMap['Enterprising mindset'].averageRating, */
  }
}
