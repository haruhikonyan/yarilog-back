import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { PlayingLogsModule } from '../playing-logs/playing-logs.module';
import { UsersService } from '../users/users.service';
import { CountriesService } from '../playing-logs/countries/countries.service';
import { ComposersService } from '../playing-logs/composers/composers.service';
import { TunesService } from '../playing-logs/tunes/tunes.service';
import { InstrumentsService } from '../playing-logs/instruments/instruments.service';
import { PlayingLogsService } from '../playing-logs/playing-logs.service';

@Module({
  imports: [
    UsersModule,
    PlayingLogsModule,
  ],
  controllers: [AdminController],
  providers: [
    UsersService,
    CountriesService,
    ComposersService,
    TunesService,
    InstrumentsService,
    PlayingLogsService
  ],
})
export class AdminModule {}
