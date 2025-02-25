import { Controller, Get } from '@nestjs/common';
import { GetClientDto } from './dto/client.dto';

@Controller('clients')
export class ClientController {
  constructor() { }

  @Get()
  getAllClients(): GetClientDto[] {
    return [
      { name: 'Mateus Carvalho', salary: 5000, enterpriseValue: 100000 },
      { name: 'Umdois de Oliveira', salary: 6000, enterpriseValue: 150000 },
    ];
  }
  @Get('/hello')
  getHello(): string {
    return 'helloWorld';
  }
}
