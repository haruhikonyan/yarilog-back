import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TunesService } from './tunes.service';
import { Tune } from './tunes.entity';
import { SaveTuneDto } from './save-tune.dto';
import { User } from '../../users/users.entity';
import { AuthService } from '../../auth/auth.service';
import { TunesWithCount } from './TunesWithCount';
import { AuthGuard } from '@nestjs/passport';

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
    @Query('composerId') composerId: string,
    @Query('playstyleId') playstyleId: string,
    @Query('genreId') genreId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('playingLogLimit') playingLogLimit: number,
  ): Promise<TunesWithCount> {
    return await this.tuneService.search(
      searchWord,
      instrumentId,
      composerId,
      playstyleId,
      genreId,
      limit,
      offset,
      playingLogLimit,
    );
  }

  @Get('tune-selector')
  async forTuneSelector(
    @Query('composerId') composerId: string,
    @Query('playstyleId') playstyleId: string,
  ): Promise<Tune[]> {
    return await this.tuneService.findAllByComposerIdAndPlaystyleId(
      composerId,
      playstyleId,
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Tune | undefined> {
    return await this.tuneService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Body() tuneData: SaveTuneDto,
    @Request() req: any,
  ): Promise<Tune> {
    tuneData.author = req.user.id;
    return await this.tuneService.create(tuneData);
  }
}
