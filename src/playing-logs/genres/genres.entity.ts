import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Tune } from '../tunes/tunes.entity';

/**
 * 曲に紐付くジャンル
 * 交響曲、オペラ、大編成など
 */
@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  /**
   * ジャンルは複数の楽曲を持つ
   */
  @ManyToMany(type => Tune, tune => tune.genres)
  tunes!: Tune[];
}