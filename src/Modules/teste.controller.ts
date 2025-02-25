import { Controller, Get } from '@nestjs/common';
import { AppService } from '../app.service';

@Controller()
export class TesteController {
  constructor(private readonly appService: AppService) { }

  @Get('/teste')
  teste(): string {
    return this.appService.test();
  }
}
