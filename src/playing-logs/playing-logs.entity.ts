import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Tune } from './tunes/tunes.entity';

/**
 * 演奏記録
 */
@Entity()
export class PlayingLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  description: string;

  /**
   * 演奏記録は一つの楽曲を持つ
   */
  @ManyToOne(type => Tune, tune => tune.playingLogs)
  tune: Tune;
}