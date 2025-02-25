import { Module } from '@nestjs/common';
import { AppController } from './Controllers/app.controller';
import { ClientController } from './clients/client.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController, ClientController],
  providers: [AppService],
})
export class AppModule { }
