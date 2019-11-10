export class SaveTuneDto {
  id: number | undefined;
  title!: string;
  description!: string;
  composerId!: string;
  playstyleId!: string;
  averageDifficulty: number | undefined;
  averagePhysicality: number | undefined;
  averageInteresting: number | undefined;
  countPlayingLogs: number | undefined;
  author: string | undefined;
  composer: Object = {};
  playstyle: Object = {};
  genreIds: string[] = [];
  genres: object[] = [];
}
