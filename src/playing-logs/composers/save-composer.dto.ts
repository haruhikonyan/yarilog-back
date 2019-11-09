export class SaveComposerDto {
  id: number | undefined;
  displayName!: string;
  fullName!: string;
  description: string | null = null;
  countryIds: string[] = [];
  author: string | undefined;
  countries: object[] = [];
}
