import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Composer } from './composers.entity';
import { Repository, Like, Not } from 'typeorm';
import { SaveComposerDto } from './save-composer.dto';

@Injectable()
export class ComposersService {
  constructor(
    @InjectRepository(Composer)
    private readonly composerRepository: Repository<Composer>,
  ) {}

  async findAll(): Promise<Composer[]> {
    return await this.composerRepository.find({ relations: ['countries'] });
  }

  async unapproved(): Promise<Composer[]> {
    return await this.composerRepository.find({ author: Not('admin') });
  }

  async findById(id: number | string): Promise<Composer | undefined> {
    return await this.composerRepository.findOne(id, {
      relations: ['countries'],
    });
  }

  async findAllTopPageLinked(): Promise<Composer[]> {
    return this.composerRepository.find({ where: { isTopPageLinked: true } });
  }
  async create(composerData: SaveComposerDto): Promise<Composer> {
    const composer = await this.composerRepository.create(composerData);
    return await this.composerRepository.save(composer);
  }

  // many to many を保存するには preload を使わなきゃなので id は取らない(composerData には id を含むこと)
  async update(composerData: SaveComposerDto): Promise<Composer> {
    const composer = await this.composerRepository.preload(composerData);
    // 存在しなければエラー出す
    if (composer == null) {
      throw new NotFoundException();
    }
    return await this.composerRepository.save(composer);
  }

  async findAllByPlaystyleId(playstyleId: string): Promise<Composer[]> {
    return await this.composerRepository
      .createQueryBuilder('composer')
      .innerJoin('composer.tunes', 'tune')
      .innerJoin('tune.playstyle', 'playstyle', 'playstyle.id = :id', {
        id: playstyleId,
      })
      .getMany();
  }

  async search(searchWord: string): Promise<Composer[]> {
    return await this.composerRepository.find({
      fullName: Like(`%${searchWord}%`),
    });
  }
}
