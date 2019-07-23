import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Composer } from './composers.entity';
import { ComposersService } from './composers.service';
import { SaveComposerDto } from './save-composer.dto';

@Controller('composers')
export class ComposersController {
    constructor(private readonly composersService: ComposersService) {}
  
    @Get()
    async findAll(): Promise<Composer[]> {
      return await this.composersService.findAll();
    }
  
    @Get(':id')
    async findById(@Param('id') id: string): Promise<Composer | null> {
      return await this.composersService.findById(id);
    }
  
    @Post()
    async create(@Body() composerData: SaveComposerDto): Promise<Composer> {
      console.log(composerData);
      return await this.composersService.create(composerData);
    }
}
