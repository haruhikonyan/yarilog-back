import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayingLog } from './playing-logs.entity';

@Injectable()
export class PlayingLogsService {
	constructor(
		@InjectRepository(PlayingLog)
		private readonly countriesRepository: Repository<PlayingLog>,
	) {}

	async findAll(): Promise<PlayingLog[]> {
		return await this.countriesRepository.find();
	}

  async findById(id: string): Promise<PlayingLog> {
    return await this.countriesRepository.findOne(id);
  }

  async save(playingLog: PlayingLog): Promise<PlayingLog> {
    return await this.countriesRepository.save(playingLog);
  }
}
