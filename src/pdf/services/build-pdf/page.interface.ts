import { PDFDocument } from 'pdfkit';
export interface PageService {
  addContentToPage(
    doc: PDFDocument,
    klientMap: CompetenceData,
    stakeholderMap: CompetenceData,
  ): void;
}
