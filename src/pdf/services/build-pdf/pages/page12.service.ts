import { PDFDocument } from 'pdfkit';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Page12Service {
  private readonly PAGE_IMAGE =
    './src/pdf/services/build-pdf/pdf/de/page-12.png';
  private readonly PAGE_WIDTH = 620;
  private readonly PAGE_HEIGHT = 842;

  async addContentToPage(
    doc: PDFDocument,
    klientMap: CompetenceData,
    stakeholderMap: CompetenceData,
  ) {
    doc.addPage().image(this.PAGE_IMAGE, 0, 0, {
      width: this.PAGE_WIDTH,
      height: this.PAGE_HEIGHT,
    });

    const { highest, lowest } = this.findHighestLowestAverageRating(klientMap);
    doc.fontSize(11);
    doc.fillColor('#696969');
    doc.text(highest.kompetenz, 215, 219);
    doc.text(lowest.kompetenz, 235, 255);
  }

  findHighestLowestAverageRating(data) {
    let highest = { kompetenz: '', averageRating: -Infinity };
    let lowest = { kompetenz: '', averageRating: Infinity };

    for (const kompetenz in data) {
      const averageRating = data[kompetenz].averageRating;

      if (averageRating > highest.averageRating) {
        highest = { kompetenz, averageRating };
      }

      if (averageRating < lowest.averageRating) {
        lowest = { kompetenz, averageRating };
      }
    }

    return { highest, lowest };
  }
}
