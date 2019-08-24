import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, SelectQueryBuilder, Brackets } from 'typeorm';
import { PlayingLog } from './playing-logs.entity';
import { PlayingLogsWithCount } from './PlayingLogsWithCount';

@Injectable()
export class PlayingLogsService {
	constructor(
		@InjectRepository(PlayingLog)
		private readonly playingLogRepository: Repository<PlayingLog>,
	) {}

	async findAll(limit: number = 20, offset: number = 0): Promise<PlayingLog[]> {
	  return await this.playingLogRepository.find({
      relations: ['tune', 'tune.composer', 'tune.composer.countries', 'user', 'instrument'],
      where: {isDraft: false},
      order: {createdAt: "DESC"},
      skip: offset,
      take: limit,
    });
  }
  
  // TODO ES とか使ってちゃんと全文検索したい
  async findAllBySearchWord(searchWord: string, instrumentId: string | null = null, limit: number = 20, offset: number = 0): Promise<PlayingLogsWithCount> {
    let sqb: SelectQueryBuilder<PlayingLog> = this.playingLogRepository.createQueryBuilder("playingLog")
      .innerJoinAndSelect("playingLog.tune", "tune")
      .innerJoinAndSelect("tune.composer", "composer")
      .innerJoinAndSelect("composer.countries", "country")
      .innerJoinAndSelect("playingLog.user", "user")
      .innerJoinAndSelect("playingLog.instrument", "instrument")
      .where({isDraft: false})
      .orderBy("playingLog.createdAt", "DESC")
      .limit(limit)
      .offset(offset)
      // 区切られてるであろう検索文字列をパースしてその分 and 検索
      this.searchWordParser(searchWord).forEach(w => {
        sqb = this.searchWord<PlayingLog>(sqb, w);
      });
      // instrumentId があれば楽器で絞り込む
      if (instrumentId) {
        sqb = sqb.andWhere("instrument.id = :instrumentId", { instrumentId: instrumentId })
      }
      return new PlayingLogsWithCount(await sqb.getManyAndCount());
  }

  // playingLogs を join された他モデルからも使用される
  searchWord<T>(sqb: SelectQueryBuilder<T>, word: string): SelectQueryBuilder<T> {
    return sqb.andWhere(new Brackets(qb => {
      qb.where(`playingLog.impressionOfInteresting LIKE '%${word}%'`)
        .orWhere(`playingLog.impressionOfDifficulty LIKE '%${word}%'`)
        .orWhere(`playingLog.reflectionForNext LIKE '%${word}%'`)
        .orWhere(`playingLog.otherPartInpression LIKE '%${word}%'`)
        .orWhere(`tune.title LIKE '%${word}%'`)
        .orWhere(`composer.fullName LIKE '%${word}%'`)
        .orWhere(`instrument.name LIKE '%${word}%'`)
    }))
  }

  searchWordParser(searchWord: string): string[] {
    return searchWord != null ? searchWord.split(/\s+/) : [];
  }
  
  async findById(id: string, isMine: boolean = false): Promise<PlayingLog | undefined> {
    if (isMine) {
      return await this.playingLogRepository.createQueryBuilder("playingLog")
        .innerJoinAndSelect("playingLog.tune", "tune")
        .innerJoinAndSelect("tune.composer", "composer")
        .innerJoinAndSelect("composer.countries", "country")
        .innerJoinAndSelect("playingLog.user", "user")
        .innerJoinAndSelect("playingLog.instrument", "instrument")
        .addSelect("playingLog.secretMemo")
        .where({id: id})
        .getOne();
    }
    else {
      return await this.playingLogRepository.findOne({
        relations: ['tune', 'tune.composer', 'tune.composer.countries', 'user', 'instrument'],
        where: {id: id, isDraft: false}
      });
    }
  }

  async findAllByComposerId(composerId: string, limit: number = 20, offset: number = 0): Promise<PlayingLog[]> {
    return await this.playingLogRepository.createQueryBuilder("playingLog")
      .innerJoinAndSelect("playingLog.tune", "tune")
      .innerJoinAndSelect("tune.composer", "composer", "composer.id = :id", { id: composerId })
      .innerJoinAndSelect("composer.countries", "country")
      .innerJoinAndSelect("playingLog.user", "user")
      .innerJoinAndSelect("playingLog.instrument", "instrument")
      .where("playingLog.isDraft = :isDraft", { isDraft: false })
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
      .where("playingLog.isDraft = :isDraft", { isDraft: false })
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
      .where("playingLog.isDraft = :isDraft", { isDraft: false })
      .orderBy("playingLog.createdAt", "DESC")
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  async findAllByTuneId(tuneId: string, limit: number = 20, offset: number = 0): Promise<PlayingLog[]> {
    return await this.playingLogRepository.createQueryBuilder("playingLog")
      .innerJoinAndSelect("playingLog.tune", "tune", "tune.id = :id", { id: tuneId })
      .innerJoinAndSelect("tune.composer", "composer")
      .innerJoinAndSelect("composer.countries", "country")
      .innerJoinAndSelect("playingLog.user", "user")
      .innerJoinAndSelect("playingLog.instrument", "instrument")
      .where("playingLog.isDraft = :isDraft", { isDraft: false })
      .orderBy("playingLog.createdAt", "DESC")
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  async findAllByUserId(userId: string, isMine: boolean = false, limit: number = 20, offset: number = 0): Promise<PlayingLog[]> {
    const sqb = this.playingLogRepository.createQueryBuilder("playingLog")
      .innerJoinAndSelect("playingLog.tune", "tune")
      .innerJoinAndSelect("tune.composer", "composer")
      .innerJoinAndSelect("composer.countries", "country")
      .innerJoinAndSelect("playingLog.user", "user", "user.id = :id", { id: userId })
      .innerJoinAndSelect("playingLog.instrument", "instrument")
      // 人で見る場合は更新順にしてみる
      .orderBy("playingLog.updatedAt", "DESC")
      .limit(limit)
      .offset(offset)

    if (isMine) {
      return await sqb.addSelect("playingLog.secretMemo").getMany()
    }
    else {
      return await sqb.where({isDraft: false}).getMany()
    }
  }

  async save(playingLog: PlayingLog): Promise<PlayingLog> {
    return await this.playingLogRepository.save(playingLog);
  }

  async update(id: string, playingLogData: PlayingLog): Promise<PlayingLog | undefined> {
    // 絶対に自分のものなので true
    const playingLog = await this.findById(id, true);
    // 存在しなければ undefined を返す
    if (playingLog == null) {
      return undefined;
    }
    await this.playingLogRepository.merge(playingLog, playingLogData);
    return await this.playingLogRepository.save(playingLog);
  }
}
