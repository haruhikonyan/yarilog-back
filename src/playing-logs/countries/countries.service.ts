import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
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

  async createInstance(): Promise<Country> {
    return await this.countriesRepository.create();
  }

  async save(country: Country): Promise<Country> {
    return await this.countriesRepository.save(country);
  }

  async update(country: Country): Promise<UpdateResult> {
    return await this.countriesRepository.update(country.id, country);
  }

}
