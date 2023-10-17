import { Module } from '@nestjs/common';
import { PdfModule } from './pdf/pdf.module';
import { PagesService } from './src/services/build-pdf/pages/pages.service';

@Module({
  imports: [PdfModule],
  controllers: [],
  providers: [PagesService],
})
export class AppModule {}
