export class SaveTuneDto {
  readonly title!: string;
  readonly description!: string;
  readonly composerId!: string;
  author: string | null = null;
  composer: Object = {};
}
