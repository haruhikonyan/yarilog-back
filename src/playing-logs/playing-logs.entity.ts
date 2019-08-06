import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tune } from './tunes/tunes.entity';
import { User } from '../users/users.entity';
import { Instrument } from './instruments/instruments.entity';


export enum PlayerLevel {
  BEGINNER = "初心者",
  INTERMEDIATE = "中級者",
  SENIOR = "上級者",
  PRO = "プロ"
}

/**
 * 演奏記録
 */
@Entity()
export class PlayingLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  readonly createdAt?: Date;
  @UpdateDateColumn()
  readonly updatedAt?: Date;

  // 演奏日
  @Column({ type: 'date', nullable: true })
  playDate: Date;

  // 演奏団体
  @Column({ nullable: true })
  team: string;

  // 自分の演奏レベル
  @Column({
    type: "enum",
    enum: PlayerLevel,
    default: PlayerLevel.BEGINNER
  })
  playerLevel: PlayerLevel;

  // 担当パート
  @ManyToOne(type => Instrument, instrument => instrument.playingLogs)
  instrument: Instrument;

  // ポジション 1stとかバンダとか
  @Column({ nullable: true })
  position: string;

  // 難易度 0~5 小数点第１位
  @Column('double')
  difficulty: number;
  // 体力 0~5 小数点第１位
  @Column('double')
  physicality: number;
  // 面白さ 0~5 小数点第１位
  @Column('double')
  interesting: number;

  // 面白かったところ
  @Column({ type: 'text', nullable: true })
  impressionOfInteresting: string;
  // 難しかったところ
  @Column({ type: 'text', nullable: true })
  impressionOfDifficulty: string;
  // 次への反省
  @Column({ type: 'text', nullable: true })
  reflectionForNext: string;
  // 他のパートや全体について
  @Column({ type: 'text', nullable: true })
  otherPartInpression: string;
  // 非公開のメモ
  @Column({ type: 'text', nullable: true })
  secretMemo: string;
  
  //　下書きフラグ
  @Column()
  isDraft: boolean;

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
