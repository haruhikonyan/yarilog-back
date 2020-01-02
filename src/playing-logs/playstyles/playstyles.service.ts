import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playstyle } from './playstyles.entity';
import { SavePlaystyleDto } from './save-playstyle.dto';

@Injectable()
export class PlaystylesService {
  constructor(
    @InjectRepository(Playstyle)
    private readonly playstylesRepository: Repository<Playstyle>,
  ) {}

  async findAll(): Promise<Playstyle[]> {
    return await this.playstylesRepository.find({
      order: { sortOrder: 'ASC' },
    });
  }

  async findById(id: number | string): Promise<Playstyle | undefined> {
    return await this.playstylesRepository.findOne(id);
  }

  async create(playstyleData: SavePlaystyleDto): Promise<Playstyle> {
    const playstyle = await this.playstylesRepository.create(playstyleData);
    return await this.playstylesRepository.save(playstyle);
  }

  async update(
    id: number,
    playstyleData: SavePlaystyleDto,
  ): Promise<Playstyle> {
    const playstyle = await this.findById(id);
    // 存在しなければエラーを返す
    if (playstyle == null) {
      throw new NotFoundException();
    }
    await this.playstylesRepository.merge(playstyle, playstyleData);
    return await this.playstylesRepository.save(playstyle);
  }

  async findAllByExistPlayingLogs() {
    return this.playstylesRepository
      .createQueryBuilder('playstyle')
      .innerJoin('playstyle.playingLogs', 'playingLog')
      .select('playstyle.id')
      .getMany();
  }
}
