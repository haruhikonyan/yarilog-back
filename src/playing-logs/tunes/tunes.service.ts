import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tune } from './tunes.entity';

@Injectable()
export class TunesService {
	constructor(
		@InjectRepository(Tune)
		private readonly tunesRepository: Repository<Tune>,
	) {}

	async findAll(): Promise<Tune[]> {
		return await this.tunesRepository.find();
	}

  async findById(id: string): Promise<Tune> {
    return await this.tunesRepository.findOne(id);
  }

  async save(tune: Tune): Promise<Tune> {
    return await this.tunesRepository.save(tune);
  }

}
