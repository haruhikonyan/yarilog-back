import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, SelectQueryBuilder } from 'typeorm';

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

  async search(searchWord: string, instrumentId: string | null = null, limit: number = 20, offset: number = 0, playingLogLimit: number = 5): Promise<TunesWithCount> {
    let sqb: SelectQueryBuilder<Tune> = this.tunesRepository.createQueryBuilder("tune")
      .leftJoinAndSelect("tune.playingLogs", "playingLog", "playingLog.isDraft = :isDraft", { isDraft: false })
      .innerJoinAndSelect("playingLog.user", "user")
      .innerJoinAndSelect("playingLog.instrument", "instrument")
      .innerJoinAndSelect("tune.composer", "composer")
      .limit(limit)
      .offset(offset)

      // 区切られてるであろう検索文字列をパースしてその分 and 検索
      this.playingLogService.searchWordParser(searchWord).forEach(w => {
        sqb = this.playingLogService.searchWord<Tune>(sqb, w);
      });
      // instrumentId があれば楽器で絞り込む
      if (instrumentId) {
        sqb = sqb.andWhere("instrument.id = :instrumentId", { instrumentId: instrumentId })
      }
      // 検索結果総数と結果オブジェクト生成
      const tunesWithCount = new TunesWithCount(await sqb.getManyAndCount());
      // 曲1件あたりの演奏記録を絞る(0の場合は絞り込まない)
      if (playingLogLimit != 0) {
        tunesWithCount.tunes.forEach(t => {
          t.playingLogs = t.playingLogs.slice(0, playingLogLimit)
        })
      }
      return tunesWithCount;
  }

  async update(id: number, tuneData: SaveTuneDto): Promise<Tune> {
    const tune = await this.findById(id);
    // 存在しなければ エラー を返す
    if (tune == null) {
      // TODO ちゃんとしたエラー
      throw Error();
    }
    // 型エラー回避のための as DeepPartial<Tune>
    await this.tunesRepository.merge(tune, tuneData as DeepPartial<Tune>);
    return await this.tunesRepository.save(tune);
  }

  /**
   * 曲に紐づく演奏記録のポイントの平均を計算し、保存する
   * @param tune
   */
  async aggrAveragePointAndSave(tune: Tune): Promise<Tune> {
    const pointsPlayingLogs = await this.playingLogService.findAllPoints(tune.id);
    // 紐づく演奏記録が無ければ何もせず Tune を返す
    if(pointsPlayingLogs.length == 0) {
      return tune;
    }
    const playingLogAveragePoint = this.playingLogService.aggrAveragePoint(pointsPlayingLogs);
    const saveTuneDto = new SaveTuneDto();
    saveTuneDto.averageDifficulty = playingLogAveragePoint.averageDifficulty
    saveTuneDto.averagePhysicality = playingLogAveragePoint.averagePhysicality
    saveTuneDto.averageInteresting = playingLogAveragePoint.averageInteresting
    return await this.update(tune.id, saveTuneDto);
  }
  /**
   * すべての曲に対して、演奏記録のポイントの平均を計算し、保存する
   */
  async allAgrAveragePointAndSave(): Promise<Tune[]> {
    const tunes: Tune[] = await this.findAll();
    return await Promise.all(tunes.map((t) => this.aggrAveragePointAndSave(t)));
  }
}
