import { Controller, Get } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { Country } from './countries.entity';

@Controller('countries')
export class CountriesController {
    constructor(private readonly countriesService: CountriesService) {}
  
    @Get()
    async findAll(): Promise<Country[]> {
      return await this.countriesService.findAll();
    }

}
