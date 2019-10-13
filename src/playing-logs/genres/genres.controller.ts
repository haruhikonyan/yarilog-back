import { Controller, Get, Query } from '@nestjs/common';
import { Genre } from './genres.entity';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
  constructor(private readonly genreService: GenresService) {}
  @Get('search')
  async search(@Query('searchWord') searchWord: string): Promise<Genre[]> {
    return await this.genreService.search(searchWord);
  }
}
