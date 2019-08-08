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
	  return await this.playingLogRepository.find({relations: ['tune', 'tune.composer', 'tune.composer.countries', 'user', 'instrument'], order: {createdAt: "DESC"}});
	}

  async findById(id: string): Promise<PlayingLog> {
    return await this.playingLogRepository.findOne(id, {relations: ['tune', 'tune.composer', 'tune.composer.countries', 'user', 'instrument']});
  }

  async findAllByComposerId(composerId: string): Promise<PlayingLog[]> {
    return await this.playingLogRepository.createQueryBuilder("playingLog")
      .innerJoinAndSelect("playingLog.tune", "tune")
      .innerJoinAndSelect("tune.composer", "composer", "composer.id = :id", { id: composerId })
      .innerJoinAndSelect("composer.countries", "country")
      .innerJoinAndSelect("playingLog.user", "user")
      .innerJoinAndSelect("playingLog.instrument", "instrument")
      .orderBy("playingLog.createdAt", "DESC")
      .getMany();
  }

  async findAllByCountryId(countryId: string): Promise<PlayingLog[]> {
    return await this.playingLogRepository.createQueryBuilder("playingLog")
      .innerJoinAndSelect("playingLog.tune", "tune")
      .innerJoinAndSelect("tune.composer", "composer")
      .innerJoinAndSelect("composer.countries", "country", "country.id = :id", { id: countryId })
      .innerJoinAndSelect("playingLog.user", "user")
      .innerJoinAndSelect("playingLog.instrument", "instrument")
      .orderBy("playingLog.createdAt", "DESC")
      .getMany();
  }

  async findAllByInstrumentId(instrumentId: string): Promise<PlayingLog[]> {
    return await this.playingLogRepository.createQueryBuilder("playingLog")
      .innerJoinAndSelect("playingLog.tune", "tune")
      .innerJoinAndSelect("tune.composer", "composer")
      .innerJoinAndSelect("composer.countries", "country")
      .innerJoinAndSelect("playingLog.user", "user")
      .innerJoinAndSelect("playingLog.instrument", "instrument", "instrument.id = :id", { id: instrumentId })
      .orderBy("playingLog.createdAt", "DESC")
      .getMany();
  }

  async findAllByUserId(userId: string): Promise<PlayingLog[]> {
    return await this.playingLogRepository.createQueryBuilder("playingLog")
      .innerJoinAndSelect("playingLog.tune", "tune")
      .innerJoinAndSelect("tune.composer", "composer")
      .innerJoinAndSelect("composer.countries", "country")
      .innerJoinAndSelect("playingLog.user", "user", "user.id = :id", { id: userId })
      .innerJoinAndSelect("playingLog.instrument", "instrument")
      // 人で見る場合は更新順にしてみる
      .orderBy("playingLog.updatedAt", "DESC")
      .getMany();
  }

  async save(playingLog: PlayingLog): Promise<PlayingLog> {
    return await this.playingLogRepository.save(playingLog);
  }

  async update(id: string, playingLogData: PlayingLog): Promise<PlayingLog> {
    const playingLog = await this.findById(id);
    await this.playingLogRepository.merge(playingLog, playingLogData);
    return await this.playingLogRepository.save(playingLog);
  }
}
