import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Composer } from './composers.entity';
import { Repository } from 'typeorm';
import { SaveComposerDto } from './save-composer.dto';

@Injectable()
export class ComposersService {
  constructor(
    @InjectRepository(Composer)
    private readonly composerRepository: Repository<Composer>,
  ) {}

  async findAll(): Promise<Composer[]> {
    return await this.composerRepository.find({relations: ['countries']});
  }

  async findById(id: number): Promise<Composer> {
    return await this.composerRepository.findOne(id, {relations: ['countries']});
  }

  async create(composerData: SaveComposerDto): Promise<Composer> {
    console.log(composerData)
    const composer = await this.composerRepository.create(composerData);
    return await this.composerRepository.save(composer);
  }

  async update(composerData: SaveComposerDto): Promise<Composer> {
    const composer = await this.composerRepository.preload(composerData);
    return await this.composerRepository.save(composer);
  }
}
