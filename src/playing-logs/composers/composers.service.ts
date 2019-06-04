import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Composer } from './composers.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ComposersService {
  constructor(
    @InjectRepository(Composer)
    private readonly composerRepository: Repository<Composer>,
  ) {}

  async findAll(): Promise<Composer[]> {
    return await this.composerRepository.find({relations: ['countries']});
  }

  async findById(id: string): Promise<Composer> {
    return await this.composerRepository.findOne(id);
  }

  async save(composer: Composer): Promise<Composer> {
    return await this.composerRepository.save(composer);
  }
}
