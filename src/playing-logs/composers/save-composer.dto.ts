import { Country } from "../countries/countries.entity";

export class SaveComposerDto {
  id: number | undefined;
  readonly displayName!: string;
  readonly fullName!: string;
  readonly description: string | null = null;
  readonly countryIds: string[] = [];
  countries: object[] = [];
}