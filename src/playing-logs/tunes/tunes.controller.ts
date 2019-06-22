import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TunesService } from './tunes.service';
import { Tune } from './tunes.entity';

@Controller('tunes')
export class TunesController {
  constructor(private readonly tuneService: TunesService) {}

  @Get()
  async findAll(): Promise<Tune[]> {
    return await this.tuneService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Tune | null> {
    return await this.tuneService.findById(id);
  }

  @Post()
  async create(@Body() countryData: Tune): Promise<Tune> {
    return await this.tuneService.save(countryData);
  }

}
