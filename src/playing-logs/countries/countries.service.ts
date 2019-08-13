import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findById(id: number | string): Promise<Country | undefined> {
    return await this.countriesRepository.findOne(id);
  }

  async create(countryData: SaveCountryDto): Promise<Country> {
    const country = await this.countriesRepository.create(countryData);
    return await this.countriesRepository.save(country);
  }

  async update(id: number, countryData: SaveCountryDto): Promise<Country | undefined> {
    const country = await this.findById(id);
    // 存在しなければ undefined を返す
    if (country == null) {
      return undefined;
    }
    await this.countriesRepository.merge(country, countryData);
    return await this.countriesRepository.save(country);
  }

}
