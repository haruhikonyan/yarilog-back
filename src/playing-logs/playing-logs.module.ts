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

@Module({
  imports: [TypeOrmModule.forFeature([PlayingLog, Country, Composer, Tune])],
  controllers: [PlayingLogsController, CountriesController, ComposersController, TunesController],
  providers: [PlayingLogsService, CountriesService, ComposersService, TunesService]
})
export class PlayingLogsModule {}