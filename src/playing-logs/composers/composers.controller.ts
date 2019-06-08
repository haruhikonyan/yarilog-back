import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Composer } from './composers.entity';
import { ComposersService } from './composers.service';

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
    async create(@Body() composerData: Composer): Promise<Composer> {
      console.log(composerData);
      return await this.composersService.save(composerData);
    }
}
