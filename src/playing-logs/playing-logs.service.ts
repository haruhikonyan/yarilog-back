import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayingLog } from './playing-logs.entity';

@Injectable()
export class PlayingLogsService {
	constructor(
		@InjectRepository(PlayingLog)
		private readonly playingLogRepository: Repository<PlayingLog>,
	) {}

	async findAll(): Promise<PlayingLog[]> {
	  return await this.playingLogRepository.find({relations: ['tune', 'tune.composer', 'tune.composer.countries', 'user']});
	}

  async findById(id: string): Promise<PlayingLog> {
    return await this.playingLogRepository.findOne(id, {relations: ['tune', 'tune.composer', 'tune.composer.countries', 'user']});
  }

  async findAllByComposerId(composerId: string): Promise<PlayingLog[]> {
    return await this.playingLogRepository.createQueryBuilder("playingLog")
      .innerJoinAndSelect("playingLog.tune", "tune")
      .innerJoinAndSelect("tune.composer", "composer", "composer.id = :id", { id: composerId })
      .innerJoinAndSelect("composer.countries", "country")
      .innerJoinAndSelect("playingLog.user", "user")
      .getMany();
  }

  async findAllByCountryId(countryId: string): Promise<PlayingLog[]> {
    return await this.playingLogRepository.createQueryBuilder("playingLog")
      .innerJoinAndSelect("playingLog.tune", "tune")
      .innerJoinAndSelect("tune.composer", "composer")
      .innerJoinAndSelect("composer.countries", "country", "composer.id = :id", { id: countryId })
      .innerJoinAndSelect("playingLog.user", "user")
      .getMany();
  }

  async save(playingLog: PlayingLog): Promise<PlayingLog> {
    return await this.playingLogRepository.save(playingLog);
  }
}
