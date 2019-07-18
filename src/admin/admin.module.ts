import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from 'src/users/users.module';
import { PlayingLogsModule } from 'src/playing-logs/playing-logs.module';
import { UsersService } from 'src/users/users.service';
import { CountriesService } from 'src/playing-logs/countries/countries.service';
import { ComposersService } from 'src/playing-logs/composers/composers.service';

@Module({
  imports: [
    UsersModule,
    PlayingLogsModule,
  ],
  controllers: [AdminController],
  providers: [
    UsersService,
    CountriesService,
    ComposersService
  ],
})
export class AdminModule {}
