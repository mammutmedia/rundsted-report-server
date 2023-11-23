import { PDFDocument } from 'pdfkit';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Page12Service {
  private readonly PAGE_WIDTH = 620;
  private readonly PAGE_HEIGHT = 842;

  async addContentToPage(
    doc: PDFDocument,
    klientMap: CompetenceData,
    language: Language,
    PDF_LOCATION: string,
  ) {
    doc.addPage().image(PDF_LOCATION, 0, 0, {
      width: this.PAGE_WIDTH,
      height: this.PAGE_HEIGHT,
    });

    const { highest, lowest } = this.findHighestLowestAverageRating(
      klientMap,
      language,
    );
    doc.fontSize(11);
    doc.fillColor('#696969');
    doc.text(highest.kompetenz, 240, 219);
    doc.text(lowest.kompetenz, 240, 237);
  }

  findHighestLowestAverageRating(data, language: Language) {
    let highest = { kompetenz: '', averageRating: -Infinity };
    let lowest = { kompetenz: '', averageRating: Infinity };

    for (const kompetenz in data) {
      const averageRating = data[kompetenz].averageRating;
      const kompetenzLanguage = data[kompetenz][language];

      if (averageRating > highest.averageRating) {
        highest = { kompetenz: kompetenzLanguage, averageRating };
      }

      if (averageRating < lowest.averageRating) {
        lowest = { kompetenz: kompetenzLanguage, averageRating };
      }
    }

    return { highest, lowest };
  }
}
