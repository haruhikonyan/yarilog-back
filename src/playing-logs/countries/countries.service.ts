import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Country } from './countries.entity';
import { SaveCountryDto } from './save-country.dto';

@Injectable()
export class CountriesService {
	constructor(
		@InjectRepository(Country)
		private readonly countriesRepository: Repository<Country>,
	) {}

	async findAll(): Promise<Country[]> {
		return await this.countriesRepository.find();
	}

  async findById(id: number): Promise<Country> {
    return await this.countriesRepository.findOne(id);
  }

  async create(countryData: SaveCountryDto): Promise<Country> {
    const country = await this.countriesRepository.create(countryData);
    return await this.countriesRepository.save(country);
  }

  async update(id:number, countryData: SaveCountryDto): Promise<Country> {
    const country = await this.countriesRepository.findOne(id);
    await this.countriesRepository.merge(country, countryData);
    return await this.countriesRepository.save(country);
  }

}
