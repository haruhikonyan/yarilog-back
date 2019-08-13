import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Tune } from './tunes.entity';
import { SaveTuneDto } from './save-tune.dto';

@Injectable()
export class TunesService {
	constructor(
		@InjectRepository(Tune)
		private readonly tunesRepository: Repository<Tune>,
	) {}

	async findAll(): Promise<Tune[]> {
		return await this.tunesRepository.find({relations: ['composer']});
	}

  async findById(id: number | string): Promise<Tune | undefined> {
    return await this.tunesRepository.findOne(id, {relations: ['composer']});
  }

  async create(tuneData: SaveTuneDto): Promise<Tune> {
    const country = await this.tunesRepository.create(tuneData as DeepPartial<Tune>);
    return await this.tunesRepository.save(country);
  }

  async findAllByComposerId(composerId: string): Promise<Tune[]> {
    return await this.tunesRepository.createQueryBuilder("tune")
      .innerJoinAndSelect("tune.composer", "composer", "composer.id = :id", { id: composerId })
      .getMany();
  }

  async update(id: number, tuneData: SaveTuneDto): Promise<Tune | undefined> {
    const tune = await this.findById(id);
    // 存在しなければ undefined を返す
    if (tune == null) {
      return undefined;
    }
    // 型エラー回避のための as DeepPartial<Tune>
    await this.tunesRepository.merge(tune, tuneData as DeepPartial<Tune>);
    return await this.tunesRepository.save(tune);
  }

}
