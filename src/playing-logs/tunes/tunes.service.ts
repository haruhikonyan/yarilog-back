import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DeepPartial,
  SelectQueryBuilder,
  Not,
  Brackets,
} from 'typeorm';

import { Tune } from './tunes.entity';
import { SaveTuneDto } from './save-tune.dto';
import { PlayingLogsService } from '../playing-logs.service';
import { TunesWithCount } from './TunesWithCount';

@Injectable()
export class TunesService {
  constructor(
    @InjectRepository(Tune)
    private readonly tunesRepository: Repository<Tune>,
    @Inject(forwardRef(() => PlayingLogsService))
    private readonly playingLogService: PlayingLogsService,
  ) {}

  async findAll(): Promise<Tune[]> {
    return await this.tunesRepository.find({
      relations: ['composer', 'playstyle', 'genres'],
    });
  }

  async unapproved(): Promise<Tune[]> {
    return await this.tunesRepository.find({
      where: {
        author: Not('admin'),
      },
      relations: ['composer', 'playstyle', 'genres'],
    });
  }

  async unapprovedTunesCount() {
    return await this.tunesRepository.count({
      where: {
        author: Not('admin'),
      },
      relations: ['composer', 'playstyle', 'genres'],
    });
  }
  // 下書きでは無い演奏記録が紐づいている曲数を返す
  async allHasPlayingLogTunesCount() {
    return this.tunesRepository
      .createQueryBuilder('tune')
      .innerJoinAndSelect(
        'tune.playingLogs',
        'playingLog',
        'playingLog.isDraft = :isDraft',
        { isDraft: false },
      )
      .getCount();
  }

  async findById(id: number | string): Promise<Tune | undefined> {
    return await this.tunesRepository.findOne(id, {
      relations: ['composer', 'playstyle', 'genres'],
    });
  }

  async create(tuneData: SaveTuneDto): Promise<Tune> {
    const tune = await this.tunesRepository.create(tuneData);
    return await this.tunesRepository.save(tune);
  }

  /**
   * 作曲家で曲を絞り込む
   * @param composerId
   */
  async findAllByComposerId(composerId: string): Promise<Tune[]> {
    return await this.tunesRepository
      .createQueryBuilder('tune')
      .innerJoinAndSelect(
        'tune.composer',
        'composer',
        'composer.id = :composerId',
        { composerId },
      )
      .innerJoinAndSelect('tune.playstyle', 'playstyle')
      .leftJoinAndSelect('tune.genres', 'genre')
      .getMany();
  }

  /**
   * 作曲家と演奏形態で曲を絞り込む
   * 主に演奏記録作成時の曲選択に使う
   * 演奏記録に円相形態を紐づけたため今は使われてない
   * @param composerId
   * @param playstyleId
   */
  async findAllByComposerIdAndPlaystyleId(
    composerId: string,
    playstyleId: string,
  ): Promise<Tune[]> {
    return await this.tunesRepository
      .createQueryBuilder('tune')
      .innerJoinAndSelect(
        'tune.composer',
        'composer',
        'composer.id = :composerId',
        { composerId },
      )
      .innerJoinAndSelect(
        'tune.playstyle',
        'playstyle',
        'playstyle.id = :playstyleId',
        { playstyleId },
      )
      .leftJoinAndSelect('tune.genres', 'genre')
      .getMany();
  }

  async search(
    searchWord: string,
    instrumentId: string | null = null,
    composerId: string | null = null,
    playstyleId: string | null = null,
    genreId: string | null = null,
    limit: number = 20,
    offset: number = 0,
    playingLogLimit: number = 5,
  ): Promise<TunesWithCount> {
    let sqb: SelectQueryBuilder<Tune> = this.tunesRepository
      .createQueryBuilder('tune')
      .innerJoinAndSelect(
        'tune.playingLogs',
        'playingLog',
        'playingLog.isDraft = :isDraft',
        { isDraft: false },
      )
      .innerJoinAndSelect('playingLog.user', 'user')
      .innerJoinAndSelect('playingLog.instrument', 'instrument')
      .innerJoinAndSelect('playingLog.playstyle', 'playstyle')
      .innerJoinAndSelect('tune.playstyle', 'tunePlaystyle')
      .leftJoinAndSelect('tune.genres', 'genre')
      .innerJoinAndSelect('tune.composer', 'composer')
      .leftJoinAndSelect('composer.countries', 'country');

    // 区切られてるであろう検索文字列をパースしてその分 and 検索
    this.playingLogService.searchWordParser(searchWord).forEach(w => {
      sqb = this.playingLogService.searchWord<Tune>(sqb, w);
    });
    // instrumentId があれば楽器で絞り込む
    if (instrumentId) {
      sqb = sqb.andWhere('instrument.id = :instrumentId', {
        instrumentId,
      });
    }
    // composerId があれば作曲家で絞り込む
    if (composerId) {
      sqb = sqb.andWhere('composer.id = :composerId', {
        composerId,
      });
    }
    // playstyleId があれば演奏形態で絞り込む
    if (playstyleId) {
      sqb = sqb.andWhere('playstyle.id = :playstyleId', {
        playstyleId,
      });
    }
    // TODO 複数のジャンルで絞り込めたらよい？
    // TODO 絞り込むと全部のジャンルが返ってこなくなってしまう
    // genreId があればジャンルで絞り込む
    if (genreId) {
      sqb = sqb.andWhere('genre.id = :genreId', {
        genreId,
      });
    }
    sqb.orderBy('playingLog.createdAt', 'DESC');
    // 検索結果総数と結果オブジェクト生成
    const tunesWithCount = new TunesWithCount(await sqb.getManyAndCount());
    // limit が設定されていたら絞り込む
    if (limit !== 0) {
      // sqb.limit() sqb.offset メソッドを使って絞り込むと playingLogs がなぜか1つに絞られてしまうので全て取得してから手動で絞り込んでいる
      // 実態は params で受け取ったため string なので足し算するので number に変換
      // TODO 全体的に生合成を取る
      limit = Number(limit);
      offset = Number(offset);
      tunesWithCount.tunes = tunesWithCount.tunes.slice(offset, offset + limit);
    }
    // 曲1件あたりの演奏記録を絞る(0の場合は絞り込まない)
    if (playingLogLimit !== 0) {
      tunesWithCount.tunes.forEach(t => {
        t.playingLogs = t.playingLogs.slice(0, playingLogLimit);
      });
    }
    return tunesWithCount;
  }

  async searchAllTunes(
    searchWord: string,
    composerId: string | null = null,
    playstyleId: string | null = null,
    genreId: string | null = null,
    limit: number = 20,
    offset: number = 0,
    playingLogLimit: number = 5,
  ): Promise<TunesWithCount> {
    let sqb: SelectQueryBuilder<Tune> = this.tunesRepository
      .createQueryBuilder('tune')
      .innerJoinAndSelect('tune.playstyle', 'tunePlaystyle')
      .leftJoinAndSelect('tune.genres', 'genre')
      .innerJoinAndSelect('tune.composer', 'composer')
      .leftJoinAndSelect('composer.countries', 'country')
      .leftJoinAndSelect(
        'tune.playingLogs',
        'playingLog',
        'playingLog.isDraft = :isDraft',
        { isDraft: false },
      )
      .leftJoinAndSelect('playingLog.user', 'user')
      .leftJoinAndSelect('playingLog.instrument', 'instrument')
      .leftJoinAndSelect('playingLog.playstyle', 'playstyle');

    // 区切られてるであろう検索文字列をパースしてその分 and 検索
    this.playingLogService.searchWordParser(searchWord).forEach(w => {
      sqb = this.searchWord<Tune>(sqb, w);
    });
    // composerId があれば作曲家で絞り込む
    if (composerId) {
      sqb = sqb.andWhere('composer.id = :composerId', {
        composerId,
      });
    }
    // playstyleId があれば演奏形態で絞り込む
    if (playstyleId) {
      sqb = sqb.andWhere('tunePlaystyle.id = :playstyleId', {
        playstyleId,
      });
    }
    // TODO 複数のジャンルで絞り込めたらよい？
    // TODO 絞り込むと全部のジャンルが返ってこなくなってしまう
    // genreId があればジャンルで絞り込む
    if (genreId) {
      sqb = sqb.andWhere('genre.id = :genreId', {
        genreId,
      });
    }
    sqb.orderBy('playingLog.createdAt', 'DESC');
    // 検索結果総数と結果オブジェクト生成
    const tunesWithCount = new TunesWithCount(await sqb.getManyAndCount());
    // limit が設定されていたら絞り込む
    if (limit !== 0) {
      // sqb.limit() sqb.offset メソッドを使って絞り込むと playingLogs がなぜか1つに絞られてしまうので全て取得してから手動で絞り込んでいる
      // 実態は params で受け取ったため string なので足し算するので number に変換
      // TODO 全体的に生合成を取る
      limit = Number(limit);
      offset = Number(offset);
      tunesWithCount.tunes = tunesWithCount.tunes.slice(offset, offset + limit);
    }
    // 曲1件あたりの演奏記録を絞る(0の場合は絞り込まない)
    if (playingLogLimit !== 0) {
      tunesWithCount.tunes.forEach(t => {
        t.playingLogs = t.playingLogs.slice(0, playingLogLimit);
      });
    }
    return tunesWithCount;
  }

  // 曲の全文検索線用のメソッド
  searchWord<T>(
    sqb: SelectQueryBuilder<T>,
    word: string,
  ): SelectQueryBuilder<T> {
    return sqb.andWhere(
      new Brackets(qb => {
        // TODO SQL インジェクション起きそうだからどうにかする
        qb.where(`tune.title LIKE '%${word}%'`)
          .orWhere(`tune.description LIKE '%${word}%'`)
          .orWhere(`composer.fullName LIKE '%${word}%'`)
          .orWhere(`genre.name LIKE '%${word}%'`)
          .orWhere(`country.name LIKE '%${word}%'`);
      }),
    );
  }

  // many to many を保存するには preload を使わなきゃなので id は取らない(tuneData には id を含むこと)
  async update(tuneData: SaveTuneDto | Tune): Promise<Tune> {
    const tune = await this.tunesRepository.preload(tuneData);
    // 存在しなければ エラー を返す
    if (tune == null) {
      throw new NotFoundException();
    }
    return await this.tunesRepository.save(tune);
  }

  /**
   * 曲に紐づく演奏記録のポイントの平均を計算し、保存する
   * @param tune
   */
  async aggrAveragePointAndSave(tune: Tune): Promise<Tune> {
    const pointsPlayingLogs = await this.playingLogService.findAllPoints(
      tune.id,
    );
    // 紐づく演奏記録が無ければ何もせず Tune を返す
    if (pointsPlayingLogs.length === 0) {
      return tune;
    }
    const playingLogAveragePointAndCount = this.playingLogService.aggrAveragePoint(
      pointsPlayingLogs,
    );
    const saveTuneDto = new SaveTuneDto();
    saveTuneDto.id = tune.id;
    saveTuneDto.genres = tune.genres;
    saveTuneDto.averageDifficulty =
      playingLogAveragePointAndCount.averageDifficulty;
    saveTuneDto.averagePhysicality =
      playingLogAveragePointAndCount.averagePhysicality;
    saveTuneDto.averageInteresting =
      playingLogAveragePointAndCount.averageInteresting;
    saveTuneDto.countPlayingLogs =
      playingLogAveragePointAndCount.countPlayingLogs;
    return await this.update(saveTuneDto);
  }
  /**
   * すべての曲に対して、演奏記録のポイントの平均を計算し、保存する
   */
  async allAgrAveragePointAndSave(): Promise<Tune[]> {
    const tunes: Tune[] = await this.findAll();
    return await Promise.all(tunes.map(t => this.aggrAveragePointAndSave(t)));
  }
  async findAllByExistPlayingLogs() {
    return this.tunesRepository
      .createQueryBuilder('tune')
      .innerJoin('tune.playingLogs', 'playingLog')
      .select('tune.id')
      .getMany();
  }
}
