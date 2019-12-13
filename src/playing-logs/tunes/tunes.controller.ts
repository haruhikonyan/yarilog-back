import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  Query,
  UseGuards,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { TunesService } from './tunes.service';
import { Tune } from './tunes.entity';
import { SaveTuneDto } from './save-tune.dto';
import { TunesWithCount } from './TunesWithCount';
import { AuthGuard } from '@nestjs/passport';
import { GenresService } from '../genres/genres.service';

@Controller('tunes')
export class TunesController {
  constructor(
    private readonly tuneService: TunesService,
    private readonly genreService: GenresService,
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

  @Get('composers/:id')
  async findAllByComposerId(@Param('id') composerId: string): Promise<Tune[]> {
    return await this.tuneService.findAllByComposerId(composerId);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Tune | undefined> {
    return await this.tuneService.findById(id);
  }

  @Put(':id/genre')
  @UseGuards(AuthGuard())
  async addGenre(
    @Param('id') id: string,
    @Body('genreName') genreName: string,
  ): Promise<Tune | undefined> {
    const tune = await this.tuneService.findById(id);
    if (!tune) {
      throw new NotFoundException();
    }
    const genre = await this.genreService.findByNameOrCreate(genreName);
    tune.genres.push(genre);
    return this.tuneService.update(tune);
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
