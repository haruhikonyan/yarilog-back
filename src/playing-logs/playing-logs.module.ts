import { Module } from '@nestjs/common';
import { PlayingLogsController } from './playing-logs.controller';
import { PlayingLogsService } from './playing-logs.service';
import { CountriesController } from './countries/countries.controller';
import { ComposersController } from './composers/composers.controller';
import { CountriesService } from './countries/countries.service';
import { ComposersService } from './composers/composers.service';
import { TunesController } from './tunes/tunes.controller';

@Module({
  controllers: [PlayingLogsController, CountriesController, ComposersController, TunesController],
  providers: [PlayingLogsService, CountriesService, ComposersService]
})
export class PlayingLogsModule {}