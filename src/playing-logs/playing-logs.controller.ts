import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PlayingLogsService } from './playing-logs.service';
import { PlayingLog } from './playing-logs.entity';

@Controller('playing-logs')
export class PlayingLogsController {
  constructor(private readonly playingLogService: PlayingLogsService) {}

  @Get()
  async findAll(): Promise<PlayingLog[]> {
    return await this.playingLogService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<PlayingLog | null> {
    return await this.playingLogService.findById(id);
  }

  @Get('composers/:id')
  async findAllByComposerId(@Param('id') composerId: string): Promise<PlayingLog[] | null> {
    return await this.playingLogService.findAllByComposerId(composerId);
  }

  @Get('countries/:id')
  async findAllByCountryId(@Param('id') countryId: string): Promise<PlayingLog[] | null> {
    return await this.playingLogService.findAllByCountryId(countryId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() playingLogData: PlayingLog, @Request() req): Promise<PlayingLog> {
    playingLogData.user = req.user;
    return await this.playingLogService.save(playingLogData);
  }

}
