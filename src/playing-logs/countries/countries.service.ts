import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './countries.entity';

@Injectable()
export class CountriesService {
	constructor(
		@InjectRepository(Country)
		private readonly countriesRepository: Repository<Country>,
	) {}

	async findAll(): Promise<Country[]> {
		return await this.countriesRepository.find();
	}

  async findById(id: string): Promise<Country> {
    return await this.countriesRepository.findOne(id);
  }

  async save(country: Country): Promise<Country> {
    return await this.countriesRepository.save(country);
  }

}
