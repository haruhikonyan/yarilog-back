import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findById(id: number | string): Promise<Tune> {
    return await this.tunesRepository.findOne(id, {relations: ['composer']});
  }

  async create(tuneData: SaveTuneDto): Promise<Tune> {
    const country = await this.tunesRepository.create(tuneData);
    return await this.tunesRepository.save(country);
  }

  async findAllByComposerId(composerId: string): Promise<Tune[]> {
    return await this.tunesRepository.createQueryBuilder("tune")
      .innerJoinAndSelect("tune.composer", "composer", "composer.id = :id", { id: composerId })
      .getMany();
  }

  async update(id: number, tuneData: SaveTuneDto): Promise<Tune> {
    const tune = await this.findById(id);
    await this.tunesRepository.merge(tune, tuneData);
    return await this.tunesRepository.save(tune);
  }

}
