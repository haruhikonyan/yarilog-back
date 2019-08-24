import { Controller, Get, Post, Body, Param, Request, Query } from '@nestjs/common';
import { TunesService } from './tunes.service';
import { Tune } from './tunes.entity';
import { SaveTuneDto } from './save-tune.dto';
import { User } from '../../users/users.entity';
import { AuthService } from '../../auth/auth.service';
import { TunesWithCount } from './TunesWithCount';

@Controller('tunes')
export class TunesController {
  constructor(
    private readonly tuneService: TunesService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async findAll(): Promise<Tune[]> {
    return await this.tuneService.findAll();
  }

  @Get('search')
  async search(
    @Query('searchWord') searchWord: string,
    @Query('instrumentId') instrumentId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number
  ): Promise<TunesWithCount> {
    return await this.tuneService.search(searchWord, instrumentId, limit, offset);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Tune | undefined> {
    return await this.tuneService.findById(id);
  }

  @Get('composers/:id')
  async findAllByComposerId(@Param('id') composerId: string): Promise<Tune[] | null> {
    return await this.tuneService.findAllByComposerId(composerId);
  }

  @Post()
  async create(@Body() tuneData: SaveTuneDto, @Request() req: any): Promise<Tune> {
    const me: User | undefined = await this.authService.getMeByAuthorizationHeaderToken(req.headers['authorization']);
    tuneData.author = me ? me.id : 'guest';
    return await this.tuneService.create(tuneData);
  }

}
