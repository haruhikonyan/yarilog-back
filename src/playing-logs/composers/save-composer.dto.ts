export class SaveComposerDto {
  id: number | undefined;
  readonly displayName!: string;
  readonly fullName!: string;
  readonly description: string | null = null;
  readonly countryIds: string[] = [];
  author: string | undefined;
  countries: object[] = [];
}
