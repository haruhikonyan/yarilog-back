import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tune } from '../tunes/tunes.entity';
import { Country } from '../countries/countries.entity';

/**
 * 作曲家
 */
@Entity()
export class Composer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: false })
  isTopPageLinked!: boolean;

  @Column({ length: 50 })
  displayName!: string;

  @Column({ length: 50, unique: true })
  fullName!: string;

  @Column({ type: 'text', nullable: true })
  description: string | null = null;

  @Column()
  author!: string;

  /**
   * 作曲家には複数の楽曲が紐づく
   */
  @OneToMany(type => Tune, tune => tune.composer)
  tunes!: Tune[];

  /**
   * 作曲家は複数の出身国を持てる
   */
  @ManyToMany(type => Country, country => country.composers)
  @JoinTable()
  countries!: Country[];
}
