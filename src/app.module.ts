import { Module } from '@nestjs/common';
import { AppController } from './Controllers/app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from './clients/clients.module';
import { Client } from './clients/entities/client.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'myuser',
      password: 'mypassword',
      database: 'mydatabase',
      entities: [Client, User],
      synchronize: true,
    }),
    ClientsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
