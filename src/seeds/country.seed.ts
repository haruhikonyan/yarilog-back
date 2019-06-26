import { Country } from "src/playing-logs/countries/countries.entity";
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

export default class CreateCountries implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Country)
      .values([{ name: '国', description: '国サンプル'}])
      .execute()
  }
}
