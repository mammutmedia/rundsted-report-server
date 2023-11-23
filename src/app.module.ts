import { Module } from '@nestjs/common';
import { PdfModule } from './pdf/pdf.module';
import { HomeController } from './home/home.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PdfModule],
  controllers: [HomeController],
  providers: [],
})
export class AppModule {}
