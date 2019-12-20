import { Controller, Get, Query, Param } from '@nestjs/common';
import { Genre } from './genres.entity';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
  constructor(private readonly genreService: GenresService) {}
  @Get('search')
  async search(@Query('searchWord') searchWord: string): Promise<Genre[]> {
    return await this.genreService.search(searchWord);
  }

  @Get()
  async findAll(): Promise<Genre[]> {
    return await this.genreService.findAll();
  }

  @Get('top-page-linked')
  async findAllTopPageLinked(): Promise<Genre[]> {
    return this.genreService.findAllTopPageLinked();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Genre | undefined> {
    return await this.genreService.findById(id);
  }
}
