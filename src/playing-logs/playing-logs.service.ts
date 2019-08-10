import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, SelectQueryBuilder, Brackets } from 'typeorm';
import { PlayingLog } from './playing-logs.entity';

@Injectable()
export class PlayingLogsService {
	constructor(
		@InjectRepository(PlayingLog)
		private readonly playingLogRepository: Repository<PlayingLog>,
	) {}

	async findAll(limit: number = 20, offset: number = 0): Promise<PlayingLog[]> {
	  return await this.playingLogRepository.find({
      relations: ['tune', 'tune.composer', 'tune.composer.countries', 'user', 'instrument'],
      order: {createdAt: "DESC"},
      skip: offset,
      take: limit,
    });
  }
  
  // TODO ES とか使ってちゃんと全文検索したい
  async findAllBySearchWord(searchWord: string, limit: number = 20, offset: number = 0) {
    const a = 'sasa';
    let sqb: SelectQueryBuilder<PlayingLog> = this.playingLogRepository.createQueryBuilder("playingLog")
      .innerJoinAndSelect("playingLog.tune", "tune")
      .innerJoinAndSelect("tune.composer", "composer")
      .innerJoinAndSelect("composer.countries", "country")
      .innerJoinAndSelect("playingLog.user", "user")
      .innerJoinAndSelect("playingLog.instrument", "instrument")
      .orderBy("playingLog.createdAt", "DESC")
      .limit(limit)
      .offset(offset)
      // 区切られてるであろう検索文字列をパースしてその分 and 検索
      this.searchWordParser(searchWord).forEach(w => {
        sqb = this.searchWord(sqb, w);
      });
      return await sqb.getMany();
  }

  private searchWord(sqb: SelectQueryBuilder<PlayingLog>, word: string): SelectQueryBuilder<PlayingLog> {
    return sqb.andWhere(new Brackets(qb => {
      qb.where(`playingLog.impressionOfInteresting LIKE '%${word}%'`)
        .orWhere(`playingLog.impressionOfDifficulty LIKE '%${word}%'`)
        .orWhere(`playingLog.reflectionForNext LIKE '%${word}%'`)
        .orWhere(`playingLog.otherPartInpression LIKE '%${word}%'`)
        .orWhere(`tune.title LIKE '%${word}%'`)
        .orWhere(`composer.fullName LIKE '%${word}%'`)
        .orWhere(`instrument.name LIKE '%${word}%'`)
        .orWhere(`user.nickname LIKE '%${word}%'`)
    }))
  }

  private searchWordParser(searchWord: string): string[] {
    return searchWord.split(/\s+/);
  }
  

  async findById(id: string): Promise<PlayingLog> {
    return await this.playingLogRepository.findOne(id, {relations: ['tune', 'tune.composer', 'tune.composer.countries', 'user', 'instrument']});
  }

  async findAllByComposerId(composerId: string, limit: number = 20, offset: number = 0): Promise<PlayingLog[]> {
    return await this.playingLogRepository.createQueryBuilder("playingLog")
      .innerJoinAndSelect("playingLog.tune", "tune")
      .innerJoinAndSelect("tune.composer", "composer", "composer.id = :id", { id: composerId })
      .innerJoinAndSelect("composer.countries", "country")
      .innerJoinAndSelect("playingLog.user", "user")
      .innerJoinAndSelect("playingLog.instrument", "instrument")
      .orderBy("playingLog.createdAt", "DESC")
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  async findAllByCountryId(countryId: string, limit: number = 20, offset: number = 0): Promise<PlayingLog[]> {
    return await this.playingLogRepository.createQueryBuilder("playingLog")
      .innerJoinAndSelect("playingLog.tune", "tune")
      .innerJoinAndSelect("tune.composer", "composer")
      .innerJoinAndSelect("composer.countries", "country", "country.id = :id", { id: countryId })
      .innerJoinAndSelect("playingLog.user", "user")
      .innerJoinAndSelect("playingLog.instrument", "instrument")
      .orderBy("playingLog.createdAt", "DESC")
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  async findAllByInstrumentId(instrumentId: string, limit: number = 20, offset: number = 0): Promise<PlayingLog[]> {
    return await this.playingLogRepository.createQueryBuilder("playingLog")
      .innerJoinAndSelect("playingLog.tune", "tune")
      .innerJoinAndSelect("tune.composer", "composer")
      .innerJoinAndSelect("composer.countries", "country")
      .innerJoinAndSelect("playingLog.user", "user")
      .innerJoinAndSelect("playingLog.instrument", "instrument", "instrument.id = :id", { id: instrumentId })
      .orderBy("playingLog.createdAt", "DESC")
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  async findAllByUserId(userId: string, limit: number = 20, offset: number = 0): Promise<PlayingLog[]> {
    return await this.playingLogRepository.createQueryBuilder("playingLog")
      .innerJoinAndSelect("playingLog.tune", "tune")
      .innerJoinAndSelect("tune.composer", "composer")
      .innerJoinAndSelect("composer.countries", "country")
      .innerJoinAndSelect("playingLog.user", "user", "user.id = :id", { id: userId })
      .innerJoinAndSelect("playingLog.instrument", "instrument")
      // 人で見る場合は更新順にしてみる
      .orderBy("playingLog.updatedAt", "DESC")
      .limit(limit)
      .offset(offset)
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
