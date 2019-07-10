import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Tune } from './tunes/tunes.entity';
import { User } from 'src/users/users.entity';

/**
 * 演奏記録
 */
@Entity()
export class PlayingLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  description: string;

  // 演奏日 :Date
  // 自分の演奏レベル 初心者とか

  // 担当パート :楽器
  // ポジション :string 1stとかバンダとか

  // 難易度 :number
  // 体力 :number
  // 面白さ :number

  // 自分のパートの感想 :string
  // 他のパートや全体について :string
  // 非公開のメモ

  //　下書きフラグ

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