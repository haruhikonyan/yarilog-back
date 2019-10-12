import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Composer } from './composers.entity';
import { ComposersService } from './composers.service';
import { SaveComposerDto } from './save-composer.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('composers')
export class ComposersController {
  constructor(private readonly composersService: ComposersService) {}

  @Get()
  async findAll(): Promise<Composer[]> {
    return await this.composersService.findAll();
  }

  @Get('search')
  async search(@Query('searchWord') searchWord: string): Promise<Composer[]> {
    return await this.composersService.search(searchWord);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Composer | undefined> {
    return await this.composersService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Body() composerData: SaveComposerDto,
    @Request() req: any,
  ): Promise<Composer> {
    composerData.author = req.user.id;
    return await this.composersService.create(composerData);
  }

  @Get('playstyles/:id')
  async findAllByPlaystyleId(
    @Param('id') playstyleId: string,
  ): Promise<Composer[]> {
    return await this.composersService.findAllByPlaystyleId(playstyleId);
  }
}
