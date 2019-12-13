import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { PlayingLog } from '../playing-logs.entity';
import { Composer } from '../composers/composers.entity';
import { Playstyle } from '../playstyles/playstyles.entity';
import { Genre } from '../genres/genres.entity';

/**
 * 楽曲
 */
@Entity()
@Index(['title', 'playstyle', 'composer'], { unique: true })
export class Tune {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  readonly createdAt!: Date;
  @UpdateDateColumn()
  readonly updatedAt!: Date;

  @Column({ length: 50 })
  title!: string;

  @Column()
  author!: string;

  @Column({ type: 'text', nullable: true })
  description: string | null = null;

  // 平均難易度 0~5 小数点第１位
  @Column({ type: 'double', default: 0 })
  averageDifficulty!: number;
  // 平均体力 0~5 小数点第１位
  @Column({ type: 'double', default: 0 })
  averagePhysicality!: number;
  // 平均面白さ 0~5 小数点第１位
  @Column({ type: 'double', default: 0 })
  averageInteresting!: number;

  // 演奏記録の総数
  @Column({ default: 0 })
  countPlayingLogs!: number;

  /**
   * 楽曲には複数の演奏記録が紐づく
   */
  @OneToMany(type => PlayingLog, playingLog => playingLog.tune)
  playingLogs!: PlayingLog[];

  /**
   * 楽曲は一人の作曲家を持つ
   */
  @ManyToOne(type => Composer, composer => composer.tunes, {
    nullable: false,
  })
  composer!: Composer;

  /**
   * 楽曲は一つの演奏形態を持つ
   * デフォルトの演奏形態を持つ
   */
  @ManyToOne(type => Playstyle, playstyle => playstyle.tunes, {
    nullable: true,
  })
  playstyle!: Playstyle;

  /**
   * 楽曲は複数のジャンルを持つ
   */
  @ManyToMany(type => Genre, genre => genre.tunes)
  @JoinTable()
  genres!: Genre[];
}
