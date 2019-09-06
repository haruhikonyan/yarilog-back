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
import { PlaystylesService } from '../playing-logs/playstyles/playstyles.service';
import { GenresService } from '../playing-logs/genres/genres.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Country } from '../playing-logs/countries/countries.entity';
import { Composer } from '../playing-logs/composers/composers.entity';
import { Tune } from '../playing-logs/tunes/tunes.entity';
import { Instrument } from '../playing-logs/instruments/instruments.entity';
import { Genre } from '../playing-logs/genres/genres.entity';
import { Playstyle } from '../playing-logs/playstyles/playstyles.entity';
import { PlayingLog } from '../playing-logs/playing-logs.entity';
@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User, Country, Composer, Tune, Instrument, Genre, Playstyle, PlayingLog]),
    PlayingLogsModule,
  ],
  controllers: [AdminController],
  providers: [
    UsersService,
    CountriesService,
    ComposersService,
    TunesService,
    InstrumentsService,
    PlayingLogsService,
    PlaystylesService,
    GenresService,
  ],
})
export class AdminModule {}
