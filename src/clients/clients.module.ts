import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { User } from '../users/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Client, User])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule { }
