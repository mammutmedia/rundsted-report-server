import { Module } from '@nestjs/common';
import { PdfModule } from './pdf/pdf.module';
import { HomeController } from './home/home.controller';

@Module({
  imports: [PdfModule],
  controllers: [HomeController],
  providers: [],
})
export class AppModule {}
