import { Controller, Get } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { Instrument } from './instruments.entity';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly instrumentsService: InstrumentsService) {}
  @Get()
  async findAll(): Promise<Instrument[]> {
    return await this.instrumentsService.findAll();
  }
}
