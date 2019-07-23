import { Country } from "../countries/countries.entity";

export class SaveComposerDto {
  id: number;
  readonly lastName: string;
  readonly fullName: string;
  readonly description: string;
  readonly countryIds: string[] = [];
  countries: object[];
}