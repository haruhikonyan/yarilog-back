export class SaveTuneDto {
  readonly title: string;
  readonly description: string;
  readonly composerId: string;
  composer: {id: string} = {
    id: null
  }
}
