import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './genres.entity';
import { SaveGenreDto } from './save-genre.dto';

@Injectable()
export class GenresService {
	constructor(
		@InjectRepository(Genre)
		private readonly genresRepository: Repository<Genre>,
	) {}

	async findAll(): Promise<Genre[]> {
		return await this.genresRepository.find();
	}

  async findById(id: number | string): Promise<Genre | undefined> {
    return await this.genresRepository.findOne(id);
  }

  async create(genreData: SaveGenreDto): Promise<Genre> {
    const genre = await this.genresRepository.create(genreData);
    return await this.genresRepository.save(genre);
  }

  async update(id: number, genreData: SaveGenreDto): Promise<Genre> {
    const genre = await this.findById(id);
    // 存在しなければエラーを返す
    if (genre == null) {
      throw new NotFoundException();
    }
    await this.genresRepository.merge(genre, genreData);
    return await this.genresRepository.save(genre);
  }}
