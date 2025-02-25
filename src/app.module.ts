import { Module } from '@nestjs/common';
import { AppController } from './Controllers/app.controller';
import { ClientController } from './clients/client.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'simform',
      username: 'postgres',
      entities: [],
      database: 'pgWithNest',
      synchronize: true,
      logging: true,
    }),
    UserModule,
    ClientsModule,
  ],
  controllers: [AppController, ClientController],
  providers: [AppService],
})
export class AppModule { }
