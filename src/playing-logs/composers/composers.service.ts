import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Composer } from './composers.entity';
import { Repository, UpdateResult } from 'typeorm';

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
    return await this.composerRepository.findOne(id, {relations: ['countries']});
  }

  async createInstance(): Promise<Composer> {
    return await this.composerRepository.create();
  }

  async save(composer: Composer): Promise<Composer> {
    return await this.composerRepository.save(composer);
  }

  async update(composerData: any) {
    const composer = await this.findById(composerData.id)
    await this.composerRepository.merge(composer, composerData);
    console.log(composer)
    return await this.composerRepository.save(composer)
    // this.composerRepository.createQueryBuilder()
    //   .relation(Composer, "countries")
    //   .of(composer)
    //   .add(composer.countries)
    // return this.composerRepository.createQueryBuilder()
    //   .update(Composer)
    //   .set(composer)
    //   .where("id = :id", { id: composer.id })
    //   .execute();
    // return await this.composerRepository.update(composer.id, composer);
  }
}
