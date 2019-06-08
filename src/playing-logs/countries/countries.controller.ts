import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { Country } from './countries.entity';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async findAll(): Promise<Country[]> {
    return await this.countriesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Country | null> {
    return await this.countriesService.findById(id);
  }

  @Post()
  async create(@Body() countryData: Country): Promise<Country> {
    return await this.countriesService.save(countryData);
  }

}
