import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { PlayingLogsModule } from './playing-logs/playing-logs.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    PlayingLogsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
