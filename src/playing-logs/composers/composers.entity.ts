import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Tune } from '../tunes/tunes.entity';
import { Country } from '../countries/countries.entity';

/**
 * 作曲家
 */
@Entity()
export class Composer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 50 })
  fullName: string;

  @Column('text')
  description: string;

  /**
   * 作曲家には複数の楽曲が紐づく
   */
  @OneToMany(type => Tune, tune => tune.composer)
  tunes: Tune[];

  /**
   * 作曲家は複数の出身国を持てる
   */
  @ManyToMany(type => Country)
  @JoinTable()
  countrys: Country[];
}