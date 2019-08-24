import { Tune } from "./tunes.entity";

export class TunesWithCount {
  tunes!: Tune[];
  totalCount!: number;
  
  constructor(playingLogsAndCount: [Tune[], number]) {
    this.tunes = playingLogsAndCount[0];
    this.totalCount = playingLogsAndCount[1];
  }
}