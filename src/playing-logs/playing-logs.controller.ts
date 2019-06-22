import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PlayingLogsService } from './playing-logs.service';
import { PlayingLog } from './playing-logs.entity';

@Controller('playing-logs')
export class PlayingLogsController {
  constructor(private readonly countriesService: PlayingLogsService) {}

  @Get()
  async findAll(): Promise<PlayingLog[]> {
    return await this.countriesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<PlayingLog | null> {
    return await this.countriesService.findById(id);
  }

  @Post()
  async create(@Body() countryData: PlayingLog): Promise<PlayingLog> {
    return await this.countriesService.save(countryData);
  }

}
