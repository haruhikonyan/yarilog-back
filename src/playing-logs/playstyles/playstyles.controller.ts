import { Controller, Get } from '@nestjs/common';
import { PlaystylesService } from './playstyles.service';
import { Playstyle } from './playstyles.entity';

@Controller('playstyles')
export class PlaystylesController {
  constructor(
    private readonly playingLogService: PlaystylesService,
    ) {}

    @Get()
    async findAll(): Promise<Playstyle[]> {
      return await this.playingLogService.findAll();
    }
  }
