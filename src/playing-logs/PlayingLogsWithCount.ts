import { PlayingLog } from "./playing-logs.entity";

export class PlayingLogsWithCount {
  playingLogs!: PlayingLog[];
  totalCount!: number;
  
  constructor(playingLogsAndCount: [PlayingLog[], number]) {
    this.playingLogs = playingLogsAndCount[0];
    this.totalCount = playingLogsAndCount[1];
  }
}