import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HomeController {
  @Get()
  getHome() {
    return 'Hello World!';
  }
}
