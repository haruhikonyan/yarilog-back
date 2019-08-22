import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, SelectQueryBuilder } from 'typeorm';
import { Tune } from './tunes.entity';
import { SaveTuneDto } from './save-tune.dto';
import { PlayingLogsService } from '../playing-logs.service';

@Injectable()
export class TunesService {
	constructor(
		@InjectRepository(Tune)
		private readonly tunesRepository: Repository<Tune>,
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

  async search(searchWord: string, instrumentId: string | null = null, limit: number = 20, offset: number = 0): Promise<Tune[]> {
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
      const tunes = await sqb.getMany();
      // 曲1件あたりの演奏記録を5つに絞って返す
      return tunes.map(t => {
        t.playingLogs = t.playingLogs.slice(0, 4)
        return t;
      })
  }

  async update(id: number, tuneData: SaveTuneDto): Promise<Tune | undefined> {
    const tune = await this.findById(id);
    // 存在しなければ undefined を返す
    if (tune == null) {
      return undefined;
    }
    // 型エラー回避のための as DeepPartial<Tune>
    await this.tunesRepository.merge(tune, tuneData as DeepPartial<Tune>);
    return await this.tunesRepository.save(tune);
  }

}
