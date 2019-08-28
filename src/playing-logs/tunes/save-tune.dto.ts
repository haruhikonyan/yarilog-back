export class SaveTuneDto {
  id: number | undefined;
  readonly title!: string;
  readonly description!: string;
  readonly composerId!: string;
  readonly playstyleId!: string;
  averageDifficulty: number | undefined;
  averagePhysicality: number | undefined;
  averageInteresting: number | undefined;
  countPlayingLogs: number | undefined;
  author: string | undefined;
  composer: Object = {};
  playstyle: Object = {};
  readonly genreIds: string[] = [];
  genres: object[] = [];
}
