import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PlayingLog } from '../playing-logs.entity';

/**
 * 演奏記録に紐づく楽器
 */
@Entity()
export class Instrument {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  shortName!: string;

  /**
   * 楽器は1つの演奏記録に紐づく
   */
  @OneToMany(type => PlayingLog, playingLog => playingLog.instrument)
  playingLogs!: PlayingLog[];
}