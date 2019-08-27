export class SaveTuneDto {
  readonly title!: string;
  readonly description!: string;
  readonly composerId!: string;
  averageDifficulty: number | undefined;
  averagePhysicality: number | undefined;
  averageInteresting: number | undefined;
  author: string | undefined;
  composer: Object = {};
}
