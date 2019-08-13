import { Controller, Get, Param } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { Instrument } from './instruments.entity';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly instrumentsService: InstrumentsService) {}
  @Get()
  async findAll(): Promise<Instrument[]> {
    return await this.instrumentsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Instrument | undefined> {
    return await this.instrumentsService.findById(id);
  }
}
