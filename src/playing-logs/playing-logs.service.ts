import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  SelectQueryBuilder,
  Brackets,
  FindManyOptions,
} from 'typeorm';
import meanBy = require('lodash.meanby');

import { PlayingLog } from './playing-logs.entity';
import { PlayingLogsWithCount } from './PlayingLogsWithCount';
import { TunesService } from './tunes/tunes.service';

// 演奏記録のポイントの平均をセットにした型定義
export interface PlayingLogAveragePointAndCount {
  averageDifficulty: number;
  averagePhysicality: number;
  averageInteresting: number;
  countPlayingLogs: number;
}

@Injectable()
export class PlayingLogsService {
  constructor(
    @InjectRepository(PlayingLog)
    private readonly playingLogRepository: Repository<PlayingLog>,
    @Inject(forwardRef(() => TunesService))
    private readonly tunesService: TunesService,
  ) {}

  async findAll(limit: number = 20, offset: number = 0): Promise<PlayingLog[]> {
    return await this.playingLogRepository.find({
      relations: [
        'tune',
        'tune.composer',
        'tune.composer.countries',
        'tune.playstyle',
        'tune.genres',
        'user',
        'instrument',
        'playstyle',
      ],
      where: { isDraft: false },
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });
  }

  // TODO ES とか使ってちゃんと全文検索したい
  async findAllBySearchWord(
    searchWord: string,
    instrumentId: string | null = null,
    playstyleId: string | null = null,
    tuneId: string | null = null,
    limit: number = 20,
    offset: number = 0,
  ): Promise<PlayingLogsWithCount> {
    let sqb: SelectQueryBuilder<PlayingLog> = this.playingLogRepository
      .createQueryBuilder('playingLog')
      .innerJoinAndSelect('playingLog.tune', 'tune')
      .innerJoinAndSelect('tune.composer', 'composer')
      .innerJoinAndSelect('tune.playstyle', 'tunePlaystyle')
      .leftJoinAndSelect('tune.genres', 'genre')
      .innerJoinAndSelect('composer.countries', 'country')
      .innerJoinAndSelect('playingLog.user', 'user')
      .innerJoinAndSelect('playingLog.instrument', 'instrument')
      .innerJoinAndSelect('playingLog.playstyle', 'playstyle')
      .where({ isDraft: false })
      .orderBy('playingLog.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);
    // 区切られてるであろう検索文字列をパースしてその分 and 検索
    this.searchWordParser(searchWord).forEach(w => {
      sqb = this.searchWord<PlayingLog>(sqb, w);
    });
    // instrumentId があれば楽器で絞り込む
    if (instrumentId) {
      sqb = sqb.andWhere('instrument.id = :instrumentId', {
        instrumentId,
      });
    }
    // instrumentId があれば楽器で絞り込む
    if (playstyleId) {
      sqb = sqb.andWhere('playstyle.id = :playstyleId', {
        playstyleId,
      });
    }
    // tuneId があれば曲で絞り込む
    if (tuneId) {
      sqb = sqb.andWhere('tune.id = :tuneId', {
        tuneId,
      });
    }
    return new PlayingLogsWithCount(await sqb.getManyAndCount());
  }

  // playingLogs を join された他モデルからも使用される
  searchWord<T>(
    sqb: SelectQueryBuilder<T>,
    word: string,
  ): SelectQueryBuilder<T> {
    return sqb.andWhere(
      new Brackets(qb => {
        // TODO SQL インジェクション起きそうだからどうにかする
        qb.where(`playingLog.impressionOfInteresting LIKE '%${word}%'`)
          .orWhere(`playingLog.impressionOfDifficulty LIKE '%${word}%'`)
          .orWhere(`playingLog.reflectionForNext LIKE '%${word}%'`)
          .orWhere(`playingLog.otherPartInpression LIKE '%${word}%'`)
          .orWhere(`playingLog.position LIKE '%${word}%'`)
          .orWhere(`playingLog.scene LIKE '%${word}%'`)
          .orWhere(`playingLog.arranger LIKE '%${word}%'`)
          .orWhere(`tune.title LIKE '%${word}%'`)
          .orWhere(`composer.fullName LIKE '%${word}%'`)
          .orWhere(`instrument.name LIKE '%${word}%'`)
          .orWhere(`genre.name LIKE '%${word}%'`)
          .orWhere(`country.name LIKE '%${word}%'`);
      }),
    );
  }

  searchWordParser(searchWord: string): string[] {
    return searchWord != null ? searchWord.split(/\s+/) : [];
  }

  async findById(
    id: string,
    isMine: boolean = false,
  ): Promise<PlayingLog | undefined> {
    if (isMine) {
      return await this.playingLogRepository
        .createQueryBuilder('playingLog')
        .innerJoinAndSelect('playingLog.tune', 'tune')
        .innerJoinAndSelect('tune.composer', 'composer')
        .innerJoinAndSelect('tune.playstyle', 'tunePlaystyle')
        .leftJoinAndSelect('tune.genres', 'genre')
        .innerJoinAndSelect('composer.countries', 'country')
        .innerJoinAndSelect('playingLog.user', 'user')
        .innerJoinAndSelect('playingLog.instrument', 'instrument')
        .innerJoinAndSelect('playingLog.playstyle', 'playstyle')
        .addSelect('playingLog.secretMemo')
        .where({ id })
        .getOne();
    } else {
      return await this.playingLogRepository.findOne({
        relations: [
          'tune',
          'tune.composer',
          'tune.composer.countries',
          'tune.playstyle',
          'tune.genres',
          'user',
          'instrument',
          'playstyle',
        ],
        where: { id, isDraft: false },
      });
    }
  }

  async findAllByComposerId(
    composerId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<PlayingLog[]> {
    return await this.playingLogRepository
      .createQueryBuilder('playingLog')
      .innerJoinAndSelect('playingLog.tune', 'tune')
      .innerJoinAndSelect('tune.composer', 'composer', 'composer.id = :id', {
        id: composerId,
      })
      .innerJoinAndSelect('tune.playstyle', 'tunePlaystyle')
      .leftJoinAndSelect('tune.genres', 'genre')
      .innerJoinAndSelect('composer.countries', 'country')
      .innerJoinAndSelect('playingLog.user', 'user')
      .innerJoinAndSelect('playingLog.instrument', 'instrument')
      .innerJoinAndSelect('playingLog.playstyle', 'playstyle')
      .where('playingLog.isDraft = :isDraft', { isDraft: false })
      .orderBy('playingLog.createdAt', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  async findAllByCountryId(
    countryId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<PlayingLog[]> {
    return await this.playingLogRepository
      .createQueryBuilder('playingLog')
      .innerJoinAndSelect('playingLog.tune', 'tune')
      .innerJoinAndSelect('tune.composer', 'composer')
      .innerJoinAndSelect('tune.playstyle', 'tunePlaystyle')
      .leftJoinAndSelect('tune.genres', 'genre')
      .innerJoinAndSelect('composer.countries', 'country', 'country.id = :id', {
        id: countryId,
      })
      .innerJoinAndSelect('playingLog.user', 'user')
      .innerJoinAndSelect('playingLog.instrument', 'instrument')
      .innerJoinAndSelect('playingLog.playstyle', 'playstyle')
      .where('playingLog.isDraft = :isDraft', { isDraft: false })
      .orderBy('playingLog.createdAt', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  async findAllByInstrumentId(
    instrumentId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<PlayingLog[]> {
    return await this.playingLogRepository
      .createQueryBuilder('playingLog')
      .innerJoinAndSelect('playingLog.tune', 'tune')
      .innerJoinAndSelect('tune.composer', 'composer')
      .innerJoinAndSelect('tune.playstyle', 'tunePlaystyle')
      .leftJoinAndSelect('tune.genres', 'genre')
      .innerJoinAndSelect('composer.countries', 'country')
      .innerJoinAndSelect('playingLog.user', 'user')
      .innerJoinAndSelect('playingLog.playstyle', 'playstyle')
      .innerJoinAndSelect(
        'playingLog.instrument',
        'instrument',
        'instrument.id = :id',
        { id: instrumentId },
      )
      .where('playingLog.isDraft = :isDraft', { isDraft: false })
      .orderBy('playingLog.createdAt', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  async findAllByTuneId(
    tuneId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<PlayingLog[]> {
    return await this.playingLogRepository
      .createQueryBuilder('playingLog')
      .innerJoinAndSelect('playingLog.tune', 'tune', 'tune.id = :id', {
        id: tuneId,
      })
      .innerJoinAndSelect('tune.composer', 'composer')
      .innerJoinAndSelect('tune.playstyle', 'tunePlaystyle')
      .leftJoinAndSelect('tune.genres', 'genre')
      .innerJoinAndSelect('composer.countries', 'country')
      .innerJoinAndSelect('playingLog.user', 'user')
      .innerJoinAndSelect('playingLog.instrument', 'instrument')
      .innerJoinAndSelect('playingLog.playstyle', 'playstyle')
      .where('playingLog.isDraft = :isDraft', { isDraft: false })
      .orderBy('playingLog.createdAt', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();
  }
  /**
   * 与えられたパラメータの演奏記録(各種ポイントのみ)を取得する
   * @param tuneId
   * @param instrumentId
   * @param composerId
   * @param countryId
   */
  async findAllPoints(
    tuneId?: number,
    instrumentId?: number,
    composerId?: number,
    countryId?: number,
  ): Promise<PlayingLog[]> {
    let sqb = this.playingLogRepository
      .createQueryBuilder('playingLog')
      .where('playingLog.isDraft = :isDraft', { isDraft: false })
      .andWhere('playingLog.difficulty IS NOT NULL')
      .andWhere('playingLog.physicality IS NOT NULL')
      .andWhere('playingLog.interesting IS NOT NULL')
      .select([
        'playingLog.difficulty',
        'playingLog.physicality',
        'playingLog.interesting',
      ]);

    if (tuneId) {
      sqb = sqb.innerJoin('playingLog.tune', 'tune', 'tune.id = :id', {
        id: tuneId,
      });
    }
    if (instrumentId) {
      sqb = sqb.innerJoin(
        'playingLog.insturment',
        'insturment',
        'insturment.id = :id',
        { id: instrumentId },
      );
    }
    if (composerId) {
      sqb = sqb
        .innerJoin('playingLog.tune', 'tune')
        .innerJoin('tune.composer', 'composer', 'composer.id = :id', {
          id: composerId,
        });
    }
    if (countryId) {
      sqb = sqb
        .innerJoin('playingLog.tune', 'tune')
        .innerJoin('tune.composer', 'composer')
        .innerJoin('composer.countries', 'country', 'country.id = :id', {
          id: countryId,
        });
    }

    return sqb.getMany();
  }

  async findAllByUserId(
    userId: string,
    isMine: boolean = false,
    limit: number = 20,
    offset: number = 0,
  ): Promise<PlayingLog[]> {
    const searchCondition: any = {
      relations: [
        'tune',
        'tune.composer',
        'tune.composer.countries',
        'tune.playstyle',
        'tune.genres',
        'user',
        'instrument',
        'playstyle',
      ],
      where: { user: userId },
      order: { updatedAt: 'DESC' },
      skip: offset,
      take: limit,
    };
    // 自分自身でなければ下書き以外を出す
    if (!isMine) {
      searchCondition.where.isDraft = false;
    }
    // TODO 自分自身であれば secretMemo 追加 select する(現状必要ない)
    return await this.playingLogRepository.find(searchCondition);
  }

  /**
   * 与えられた演奏記録のポイントの平均を計算して返す
   * @param playingLogs
   */
  aggrAveragePoint(playingLogs: PlayingLog[]): PlayingLogAveragePointAndCount {
    return {
      // 小数点第１位で四捨五入
      averageDifficulty:
        Math.round(meanBy(playingLogs, 'difficulty') * 10) / 10,
      averagePhysicality:
        Math.round(meanBy(playingLogs, 'physicality') * 10) / 10,
      averageInteresting:
        Math.round(meanBy(playingLogs, 'interesting') * 10) / 10,
      countPlayingLogs: playingLogs.length,
    };
  }

  async save(playingLog: PlayingLog): Promise<PlayingLog> {
    const savedPlayingLog = await this.playingLogRepository.save(playingLog);
    // 下書きでないかつ評価がされているものは平均の再計算を行う
    if (
      !savedPlayingLog.isDraft &&
      savedPlayingLog.difficulty &&
      savedPlayingLog.physicality &&
      savedPlayingLog.interesting
    ) {
      this.tunesService.aggrAveragePointAndSave(savedPlayingLog.tune);
    }
    return savedPlayingLog;
  }

  async update(
    id: string,
    playingLogData: PlayingLog,
  ): Promise<PlayingLog | undefined> {
    // 絶対に自分のものなので true
    const playingLog = await this.findById(id, true);
    // 存在しなければ undefined を返す
    if (playingLog == null) {
      return undefined;
    }
    await this.playingLogRepository.merge(playingLog, playingLogData);
    const savedPlayingLog = await this.playingLogRepository.save(playingLog);
    // 下書きでないかつ評価がされているものは平均の再計算を行う
    if (
      !savedPlayingLog.isDraft &&
      savedPlayingLog.difficulty &&
      savedPlayingLog.physicality &&
      savedPlayingLog.interesting
    ) {
      this.tunesService.aggrAveragePointAndSave(savedPlayingLog.tune);
    }
    return savedPlayingLog;
  }

  /**
   * 曲に紐づいてる演奏形態をその曲が紐づく演奏記録にも紐づける
   * 演奏形態を演奏記録に紐づける改修の際のみに使う
   */
  async migratePlayingLogsPlaystyle() {
    const playingLogs = await this.findAll();
    const plomiseList = playingLogs.map(async p => {
      p.playstyle = p.tune.playstyle;
      return this.update(p.id, p);
    });
    await Promise.all(plomiseList);
  }
}
