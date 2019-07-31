import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { PlayingLog } from '../playing-logs.entity';
import { Composer } from '../composers/composers.entity';

/**
 * 楽曲
 */
@Entity()
export class Tune {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * 楽曲には複数の演奏記録が紐づく
   */
  @OneToMany(type => PlayingLog, playingLog => playingLog.tune)
  playingLogs: PlayingLog[];

  /**
   * 楽曲は一人の作曲家を持つ
   */
  @ManyToOne(type => Composer, composer => composer.tunes)
  composer: Composer;
}