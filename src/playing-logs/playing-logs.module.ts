import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayingLogsController } from './playing-logs.controller';
import { PlayingLogsService } from './playing-logs.service';
import { CountriesController } from './countries/countries.controller';
import { ComposersController } from './composers/composers.controller';
import { CountriesService } from './countries/countries.service';
import { ComposersService } from './composers/composers.service';
import { TunesController } from './tunes/tunes.controller';
import { TunesService } from './tunes/tunes.service';
import { PlayingLog } from './playing-logs.entity';
import { Country } from './countries/countries.entity';
import { Composer } from './composers/composers.entity';
import { Tune } from './tunes/tunes.entity';
import { InstrumentsController } from './instruments/instruments.controller';
import { InstrumentsService } from './instruments/instruments.service';
import { Instrument } from './instruments/instruments.entity';
import { AuthModule } from '../auth/auth.module';
import { PlaystylesController } from './playstyles/playstyles.controller';
import { PlaystylesService } from './playstyles/playstyles.service';
import { GenresService } from './genres/genres.service';
import { GenresController } from './genres/genres.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlayingLog, Country, Composer, Tune, Instrument]),
    AuthModule
],
  controllers: [PlayingLogsController, CountriesController, ComposersController, TunesController, InstrumentsController, PlaystylesController, GenresController],
  providers: [PlayingLogsService, CountriesService, ComposersService, TunesService, InstrumentsService, PlaystylesService, GenresService]
})
export class PlayingLogsModule {}