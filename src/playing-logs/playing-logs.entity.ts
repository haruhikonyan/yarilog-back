import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Tune } from './tunes/tunes.entity';
import { User } from 'src/users/users.entity';

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

  /**
   * 演奏記録は一人のユーザを持つ
   */
  @ManyToOne(type => User, user => user.playingLogs)
  user: User;
}