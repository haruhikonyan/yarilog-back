import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
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

  async findByNameOrCreate(name: string): Promise<Genre> {
    const genre = await this.genresRepository.findOne({ where: { name } });
    // genre が無ければ新しく作って返す
    return genre || (await this.create({ name }));
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
  }

  async search(searchWord: string): Promise<Genre[]> {
    return await this.genresRepository.find({
      name: Like(`%${searchWord}%`),
    });
  }
}
