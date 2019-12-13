import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Tune } from '../tunes/tunes.entity';
import { PlayingLog } from '../playing-logs.entity';

/**
 * 曲に紐付く演奏形態
 * オーケストラ、吹奏楽など
 */
@Entity()
export class Playstyle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  sortOrder!: number;

  /**
   * 演奏形態には複数の楽曲が紐づく
   */
  @OneToMany(type => Tune, tune => tune.playstyle)
  tunes!: Tune[];

  /**
   * 演奏形態には複数の楽曲が紐づく
   */
  @OneToMany(type => PlayingLog, playingLog => playingLog.playstyle)
  playingLogs!: PlayingLog[];
}
